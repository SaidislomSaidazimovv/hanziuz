"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Pencil,
  Layers,
  Brain,
  ChevronRight,
  ChevronLeft,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import HanziStroke from "./HanziStroke";
import type { Lesson, VocabWord } from "@/lib/seed-data";
import Link from "next/link";

const steps = [
  { id: "learn", label: "O'rganish", icon: BookOpen },
  { id: "practice", label: "Mashq", icon: Pencil },
  { id: "flashcards", label: "Kartochkalar", icon: Layers },
  { id: "quiz", label: "Test", icon: Brain },
];

interface LessonContentProps {
  lesson: Lesson;
  vocab: VocabWord[];
}

export default function LessonContent({ lesson, vocab }: LessonContentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentWord = vocab[currentWordIdx];
  const stepProgress = (completedSteps.length / steps.length) * 100;

  // --- Audio: Web Speech API with fallback & loading state ---
  const speak = useCallback((text: string, audioUrl?: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    try {
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          // Fallback to speech synthesis if audio file fails
          speakWithSynthesis(text);
        };
        audio.play().catch(() => speakWithSynthesis(text));
      } else {
        speakWithSynthesis(text);
      }
    } catch {
      setIsSpeaking(false);
    }

    function speakWithSynthesis(t: string) {
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(t);
          utterance.lang = "zh-CN";
          utterance.rate = 0.8;
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
        }
      } catch {
        setIsSpeaking(false);
      }
    }
  }, [isSpeaking]);

  // --- Step locking logic ---
  const isStepUnlocked = useCallback(
    (stepIndex: number) => {
      if (stepIndex === 0) return true; // Learn is always unlocked
      return completedSteps.includes(stepIndex - 1); // Previous step must be completed
    },
    [completedSteps]
  );

  const completeCurrentStepAndAdvance = useCallback(() => {
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentWordIdx(0);
      setFlipped(false);
      setQuizAnswer(null);
    }
  }, [currentStep]);

  const handleStepClick = (stepIndex: number) => {
    if (!isStepUnlocked(stepIndex)) return;
    setCurrentStep(stepIndex);
    setCurrentWordIdx(0);
    setFlipped(false);
    setQuizAnswer(null);
    setQuizDone(false);
  };

  const nextWord = () => {
    if (currentWordIdx < vocab.length - 1) {
      setCurrentWordIdx((i) => i + 1);
      setFlipped(false);
    } else {
      // Last word — complete step and advance
      completeCurrentStepAndAdvance();
    }
  };

  const prevWord = () => {
    if (currentWordIdx > 0) {
      setCurrentWordIdx((i) => i - 1);
      setFlipped(false);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    if (answer === currentWord.meaningUz) {
      setQuizScore((s) => s + 1);
    }
    setTimeout(() => {
      if (currentWordIdx < vocab.length - 1) {
        setCurrentWordIdx((i) => i + 1);
        setQuizAnswer(null);
      } else {
        setCompletedSteps((prev) =>
          prev.includes(3) ? prev : [...prev, 3]
        );
        setQuizDone(true);
      }
    }, 1000);
  };

  // Memoize quiz options so they don't reshuffle on every render
  const quizOptions = useMemo(() => {
    if (currentStep !== 3 || !currentWord) return [];
    const others = vocab
      .filter((w) => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.meaningUz);
    return [...others, currentWord.meaningUz].sort(() => Math.random() - 0.5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentWordIdx]);

  const nextStepLabel = [
    "Mashqqa o'tish",
    "Kartochkalarga o'tish",
    "Testga o'tish",
    "",
  ][currentStep];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
            HSK {lesson.hskLevel}
          </span>
          <span>Dars {lesson.orderNum}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold">{lesson.titleUz}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {lesson.descriptionUz}
        </p>
      </div>

      {/* Step indicator */}
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => {
            const unlocked = isStepUnlocked(i);
            const completed = completedSteps.includes(i);
            const active = i === currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => handleStepClick(i)}
                  disabled={!unlocked}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all w-full justify-center",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : completed
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/15"
                        : unlocked
                          ? "bg-secondary text-muted-foreground hover:bg-secondary/80"
                          : "bg-muted text-muted-foreground/50 cursor-not-allowed"
                  )}
                >
                  {completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : !unlocked ? (
                    <Lock className="w-3 h-3" />
                  ) : (
                    <step.icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mx-0.5" />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={stepProgress} className="h-1.5 rounded-full" />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentStep}-${currentWordIdx}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* STEP 1: Learn */}
          {currentStep === 0 && currentWord && (
            <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-3">
                  {currentWordIdx + 1} / {vocab.length}
                </p>
                <HanziStroke character={currentWord.hanzi.charAt(0)} />
                <div className="mt-4">
                  <h2 className="hanzi-display text-5xl mb-2">
                    {currentWord.hanzi}
                  </h2>
                  <p className="pinyin text-lg text-primary mb-1">
                    {currentWord.pinyin}
                  </p>
                  <p className="text-xl font-semibold">
                    {currentWord.meaningUz}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentWord.meaningEn}
                  </p>
                </div>

                <button
                  onClick={() =>
                    speak(currentWord.hanzi, currentWord.audioUrl)
                  }
                  disabled={isSpeaking}
                  className={cn(
                    "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    isSpeaking
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {isSpeaking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  {isSpeaking ? "Ijro etilmoqda..." : "Tinglash"}
                </button>

                {currentWord.exampleZh && (
                  <div className="mt-6 p-4 rounded-xl bg-secondary/50 text-left">
                    <p className="font-chinese text-base">
                      {currentWord.exampleZh}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentWord.exampleUz}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevWord}
                  disabled={currentWordIdx === 0}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Oldingi
                </Button>
                <Button
                  onClick={nextWord}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {currentWordIdx < vocab.length - 1 ? "Keyingi" : nextStepLabel}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Practice */}
          {currentStep === 1 && currentWord && (
            <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-3">
                  {currentWordIdx + 1} / {vocab.length} — Yozish mashqi
                </p>
                <HanziStroke
                  character={currentWord.hanzi.charAt(0)}
                  size={250}
                />
                <p className="pinyin text-lg text-primary mt-4">
                  {currentWord.pinyin}
                </p>
                <p className="text-lg font-semibold">
                  {currentWord.meaningUz}
                </p>

                <button
                  onClick={() =>
                    speak(currentWord.hanzi, currentWord.audioUrl)
                  }
                  disabled={isSpeaking}
                  className={cn(
                    "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    isSpeaking
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary hover:bg-secondary/80"
                  )}
                >
                  {isSpeaking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  {isSpeaking ? "Ijro etilmoqda..." : "Tinglash"}
                </button>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevWord}
                  disabled={currentWordIdx === 0}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Oldingi
                </Button>
                <Button
                  onClick={nextWord}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {currentWordIdx < vocab.length - 1
                    ? "Keyingi"
                    : nextStepLabel}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Flashcards */}
          {currentStep === 2 && currentWord && (
            <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
              <p className="text-xs text-muted-foreground text-center mb-3">
                {currentWordIdx + 1} / {vocab.length} — Kartochka
              </p>

              <div
                onClick={() => setFlipped(!flipped)}
                className="relative cursor-pointer mx-auto max-w-sm"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="w-full rounded-2xl border-2 border-border p-8 text-center min-h-[220px] flex flex-col items-center justify-center"
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {!flipped ? (
                    <div>
                      <span className="hanzi-display text-6xl">
                        {currentWord.hanzi}
                      </span>
                      <p className="text-sm text-muted-foreground mt-4">
                        Tarjimasini ko&apos;rish uchun bosing
                      </p>
                    </div>
                  ) : (
                    <div style={{ transform: "rotateY(180deg)" }}>
                      <p className="pinyin text-lg text-primary mb-2">
                        {currentWord.pinyin}
                      </p>
                      <p className="text-2xl font-bold">
                        {currentWord.meaningUz}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentWord.meaningEn}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={prevWord}
                  disabled={currentWordIdx === 0}
                  className="rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Oldingi
                </Button>
                <Button
                  onClick={nextWord}
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {currentWordIdx < vocab.length - 1
                    ? "Keyingi"
                    : nextStepLabel}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Quiz */}
          {currentStep === 3 && !quizDone && currentWord && (
            <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
              <p className="text-xs text-muted-foreground text-center">
                {currentWordIdx + 1} / {vocab.length} — Test
              </p>

              <div className="text-center">
                <span className="hanzi-display text-6xl">
                  {currentWord.hanzi}
                </span>
                <p className="pinyin text-base text-primary mt-2">
                  {currentWord.pinyin}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Bu so&apos;zning tarjimasi qaysi?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {quizOptions.map((opt) => {
                  const isCorrect = opt === currentWord.meaningUz;
                  const isSelected = quizAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        !quizAnswer && handleQuizAnswer(opt)
                      }
                      disabled={!!quizAnswer}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium transition-all",
                        !quizAnswer &&
                          "hover:border-primary/50 hover:bg-primary/5",
                        quizAnswer &&
                          isCorrect &&
                          "border-green-500 bg-green-500/10 text-green-700",
                        quizAnswer &&
                          isSelected &&
                          !isCorrect &&
                          "border-red-500 bg-red-500/10 text-red-700",
                        quizAnswer &&
                          !isSelected &&
                          !isCorrect &&
                          "opacity-50"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quiz complete */}
          {currentStep === 3 && quizDone && (
            <div className="rounded-2xl border bg-card p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold">Dars yakunlandi!</h2>
              <p className="text-muted-foreground">
                Natija: {quizScore} / {vocab.length} (
                {Math.round((quizScore / vocab.length) * 100)}%)
              </p>
              <p className="text-sm text-primary font-medium">
                +{lesson.xpReward} XP qo&apos;shildi
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setCurrentStep(0);
                    setCurrentWordIdx(0);
                    setCompletedSteps([]);
                    setQuizScore(0);
                    setQuizDone(false);
                    setQuizAnswer(null);
                    setFlipped(false);
                  }}
                >
                  Qaytadan
                </Button>
                <Button
                  className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  render={<Link href="/lessons" />}
                >
                  Darslarga qaytish
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
