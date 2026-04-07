"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Trophy,
  ArrowRight,
  RotateCcw,
  Volume2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Lesson, VocabWord } from "@/lib/seed-data";
import Link from "next/link";

type QuestionType = "hanzi-to-uz" | "uz-to-hanzi" | "pinyin-to-uz";

interface Question {
  type: QuestionType;
  word: VocabWord;
  prompt: string;
  correctAnswer: string;
  options: string[];
}

interface QuizComponentProps {
  lesson: Lesson;
  vocab: VocabWord[];
  allVocab: VocabWord[];
}

const TIMER_SECONDS = 15;

function buildQuestions(
  vocab: VocabWord[],
  allVocab: VocabWord[]
): Question[] {
  const questions: Question[] = [];
  const types: QuestionType[] = ["hanzi-to-uz", "uz-to-hanzi", "pinyin-to-uz"];

  for (const word of vocab) {
    const type = types[Math.floor(Math.random() * types.length)];

    let prompt: string;
    let correctAnswer: string;
    let pool: string[];

    switch (type) {
      case "hanzi-to-uz":
        prompt = word.hanzi;
        correctAnswer = word.meaningUz;
        pool = allVocab
          .filter((w) => w.id !== word.id)
          .map((w) => w.meaningUz);
        break;
      case "uz-to-hanzi":
        prompt = word.meaningUz;
        correctAnswer = word.hanzi;
        pool = allVocab
          .filter((w) => w.id !== word.id)
          .map((w) => w.hanzi);
        break;
      case "pinyin-to-uz":
        prompt = word.pinyin;
        correctAnswer = word.meaningUz;
        pool = allVocab
          .filter((w) => w.id !== word.id)
          .map((w) => w.meaningUz);
        break;
    }

    const wrongAnswers = pool
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [...wrongAnswers, correctAnswer].sort(
      () => Math.random() - 0.5
    );

    questions.push({ type, word, prompt, correctAnswer, options });
  }

  return questions;
}

export default function QuizComponent({
  lesson,
  vocab,
  allVocab,
}: QuizComponentProps) {
  const questions = useMemo(
    () => buildQuestions(vocab, allVocab),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vocab.map((v) => v.id).join(",")]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [results, setResults] = useState<
    { word: VocabWord; correct: boolean }[]
  >([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const selectedAnswerRef = useRef(selectedAnswer);
  selectedAnswerRef.current = selectedAnswer;

  const question = questions[currentIdx];
  const progressPct = (currentIdx / questions.length) * 100;

  const advance = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setQuizDone(true);
    }
  }, [currentIdx, questions.length]);

  // Timer
  useEffect(() => {
    if (quizDone || selectedAnswer) return;

    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Inline timeout logic — uses refs to avoid stale closure
          if (!selectedAnswerRef.current) {
            setSelectedAnswer("__timeout__");
            setStreak(0);
            setResults((r) => [
              ...r,
              { word: questions[currentIdx].word, correct: false },
            ]);
            setTimeout(() => {
              setCurrentIdx((i) => {
                if (i < questions.length - 1) {
                  setSelectedAnswer(null);
                  return i + 1;
                }
                setQuizDone(true);
                return i;
              });
            }, 1500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, quizDone, selectedAnswer, questions]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(answer);
    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }

    setResults((prev) => [
      ...prev,
      { word: question.word, correct: isCorrect },
    ]);

    setTimeout(() => advance(), 1200);
  };

  const speak = useCallback(
    (text: string) => {
      if (isSpeaking) return;
      setIsSpeaking(true);
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
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
    },
    [isSpeaking]
  );

  const restart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setQuizDone(false);
    setTimeLeft(TIMER_SECONDS);
    setResults([]);
  };

  // --- Results screen ---
  if (quizDone) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    const wrongAnswers = results.filter((r) => !r.correct);
    const xpEarned = Math.round((score / total) * lesson.xpReward);

    return (
      <motion.div
        className="max-w-lg mx-auto rounded-3xl border bg-card p-8 text-center space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto",
            pct >= 70 ? "bg-green-500/10" : "bg-amber-500/10"
          )}
        >
          <Trophy
            className={cn(
              "w-10 h-10",
              pct >= 70 ? "text-green-500" : "text-amber-500"
            )}
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold">Test yakunlandi!</h2>
          <p className="text-muted-foreground mt-1">{lesson.titleUz}</p>
        </div>

        {/* Score */}
        <div className="rounded-2xl bg-secondary p-5 space-y-3">
          <p className="text-4xl font-bold text-primary">{pct}%</p>
          <p className="text-sm text-muted-foreground">
            {score} / {total} to&apos;g&apos;ri javob
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-accent" />
              +{xpEarned} XP
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Eng uzun seriya: {bestStreak}
            </span>
          </div>
        </div>

        {/* Verdict */}
        <p className="text-sm font-medium">
          {pct >= 90
            ? "Ajoyib! Deyarli mukammal natija! 🎉"
            : pct >= 70
              ? "Yaxshi natija! Davom eting! 💪"
              : pct >= 50
                ? "O'rtacha. Takrorlash tavsiya etiladi."
                : "Ko'proq mashq qilish kerak. Qaytadan urinib ko'ring!"}
        </p>

        {/* Wrong answers */}
        {wrongAnswers.length > 0 && (
          <div className="text-left">
            <p className="text-sm font-medium mb-2">
              Xato javoblar ({wrongAnswers.length}):
            </p>
            <div className="space-y-2">
              {wrongAnswers.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-red-500/5 border border-red-500/10"
                >
                  <span className="hanzi-display text-lg">
                    {r.word.hanzi}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {r.word.pinyin}
                  </span>
                  <span className="text-sm font-medium ml-auto">
                    {r.word.meaningUz}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={restart}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Qaytadan
          </Button>
          <Button
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            render={<Link href="/lessons" />}
          >
            Darslarga qaytish
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </motion.div>
    );
  }

  // --- Quiz question ---
  if (!question) return null;

  const isHanziPrompt =
    question.type === "hanzi-to-uz";
  const isPinyinPrompt = question.type === "pinyin-to-uz";
  const timerPct = (timeLeft / TIMER_SECONDS) * 100;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {lesson.titleUz}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs font-medium">
              {currentIdx + 1} / {questions.length}
            </span>
            {streak >= 2 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-accent">
                <Zap className="w-3 h-3" />
                {streak} seriya
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{score}</span>
          <p className="text-[10px] text-muted-foreground">ball</p>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progressPct} className="h-1.5 rounded-full" />

      {/* Timer */}
      <div className="flex items-center gap-2">
        <Clock
          className={cn(
            "w-4 h-4",
            timeLeft <= 5 ? "text-red-500" : "text-muted-foreground"
          )}
        />
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              timeLeft <= 5 ? "bg-red-500" : "bg-primary"
            )}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span
          className={cn(
            "text-sm font-mono font-medium w-6 text-right",
            timeLeft <= 5 ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {timeLeft}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          className="rounded-2xl border bg-card p-8 text-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* Question label */}
          <p className="text-xs text-muted-foreground mb-4">
            {isHanziPrompt
              ? "Bu ieroglifning tarjimasi qaysi?"
              : isPinyinPrompt
                ? "Bu pinyinning tarjimasi qaysi?"
                : "Bu so'zning ieroglifi qaysi?"}
          </p>

          {/* Prompt */}
          <div className="mb-6">
            {isHanziPrompt ? (
              <span className="hanzi-display text-6xl">
                {question.prompt}
              </span>
            ) : isPinyinPrompt ? (
              <span className="pinyin text-3xl text-primary">
                {question.prompt}
              </span>
            ) : (
              <span className="text-3xl font-bold">{question.prompt}</span>
            )}
          </div>

          {/* Audio for hanzi/pinyin prompts */}
          {(isHanziPrompt || isPinyinPrompt) && (
            <button
              onClick={() => speak(question.word.hanzi)}
              disabled={isSpeaking}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              {isSpeaking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              Tinglash
            </button>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const isCorrect = opt === question.correctAnswer;
              const isSelected = selectedAnswer === opt;
              const isTimeout = selectedAnswer === "__timeout__";
              const answered = !!selectedAnswer;
              const isHanziOption = question.type === "uz-to-hanzi";

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={answered}
                  className={cn(
                    "p-4 rounded-xl border text-sm font-medium transition-all",
                    isHanziOption && "hanzi-display text-2xl",
                    !answered &&
                      "hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]",
                    answered &&
                      isCorrect &&
                      "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                    answered &&
                      isSelected &&
                      !isCorrect &&
                      "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                    answered &&
                      isTimeout &&
                      isCorrect &&
                      "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                    answered &&
                      !isSelected &&
                      !isCorrect &&
                      !isTimeout &&
                      "opacity-40"
                  )}
                >
                  {opt}
                  {answered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 inline-block ml-1.5 text-green-500" />
                  )}
                  {answered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 inline-block ml-1.5 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Timeout message */}
          {selectedAnswer === "__timeout__" && (
            <p className="text-sm text-red-500 font-medium mt-4">
              Vaqt tugadi!
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
