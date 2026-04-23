"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  X,
  ArrowRight,
  Trophy,
  Loader2,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { addXP, createNotification } from "@/lib/db";
import { useUser } from "@/lib/user-context";
import {
  extractTone,
  recordListeningAttempt,
  type ListeningClip,
  type ListeningMode,
} from "@/lib/db/listening";

const SESSION_SIZE = 10;
const SPEEDS = [0.75, 1, 1.5] as const;

interface Question {
  clip: ListeningClip;
  options: string[];
  correctIndex: number;
}

function shuffle<T>(array: T[]): T[] {
  const out = array.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildWordQuestions(pool: ListeningClip[]): Question[] {
  const shuffled = shuffle(pool);
  const questionClips = shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));

  return questionClips.map((clip) => {
    const distractors = shuffle(
      shuffled.filter((c) => c.transcript_zh !== clip.transcript_zh)
    )
      .slice(0, 3)
      .map((c) => c.transcript_zh);
    const options = shuffle([clip.transcript_zh, ...distractors]);
    return {
      clip,
      options,
      correctIndex: options.indexOf(clip.transcript_zh),
    };
  });
}

const TONE_LABELS = ["1-ohang ā", "2-ohang á", "3-ohang ǎ", "4-ohang à"];

function buildToneQuestions(pool: ListeningClip[]): Question[] {
  // Drop neutral-tone clips (rare in HSK 1-2 single chars)
  const clipsWithTones = pool
    .map((c) => ({ clip: c, tone: extractTone(c.transcript_pinyin) }))
    .filter((x) => x.tone >= 1 && x.tone <= 4);

  const shuffled = shuffle(clipsWithTones);
  const chosen = shuffled.slice(0, Math.min(SESSION_SIZE, shuffled.length));

  return chosen.map(({ clip, tone }) => ({
    clip,
    options: TONE_LABELS,
    correctIndex: tone - 1,
  }));
}

export default function ListeningSession({
  clips,
  hskLevel,
  mode,
  onExit,
}: {
  clips: ListeningClip[];
  hskLevel: number;
  mode: ListeningMode;
  onExit: () => void;
}) {
  const { id: userId } = useUser();
  const questions = useMemo(
    () =>
      mode === "word" ? buildWordQuestions(clips) : buildToneQuestions(clips),
    [clips, mode]
  );
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);

  const current = questions[idx];

  // Reset + auto-play when question changes
  useEffect(() => {
    setSelected(null);
    setLoadError(false);
    if (!audioRef.current || !current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = current.clip.audio_url;
    audioRef.current.playbackRate = speed;
    audioRef.current.load();
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, [current, speed]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);
    const onError = () => {
      setPlaying(false);
      setLoadError(true);
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
      el.removeEventListener("error", onError);
    };
  }, []);

  function togglePlay() {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => setPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }

  function replay() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => setPlaying(false));
  }

  function changeSpeed(s: (typeof SPEEDS)[number]) {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  }

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === current.correctIndex;
    setResults((prev) => [...prev, correct]);
    // Fire-and-forget progress tracking
    if (userId) {
      recordListeningAttempt(userId, current.clip.id, mode, correct).catch(
        () => {
          // Non-blocking; progress tracking failures don't interrupt the session.
        }
      );
    }
  }

  function next() {
    if (idx + 1 >= questions.length) {
      finishSession();
      return;
    }
    setIdx(idx + 1);
  }

  async function finishSession() {
    setDone(true);
    const correctCount = results.filter(Boolean).length;
    const xp = 5 + correctCount;
    if (userId) {
      try {
        await addXP(userId, xp);
        await createNotification(
          userId,
          "listening_done",
          "Tinglash yakunlandi!",
          `${correctCount}/${questions.length} to'g'ri. +${xp} XP`,
          "/listening"
        );
      } catch {
        // non-blocking
      }
    }
  }

  if (done) {
    const correctCount = results.filter(Boolean).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto rounded-3xl border bg-card p-8 text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Mashg&apos;ulot yakunlandi!</h2>
          <p className="text-muted-foreground mt-1">
            {correctCount} / {questions.length} to&apos;g&apos;ri
          </p>
        </div>
        <div className="rounded-xl bg-secondary p-4">
          <p className="text-4xl font-bold text-primary">{pct}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {pct >= 80
              ? "Ajoyib natija!"
              : pct >= 50
                ? "Yaxshi! Davom eting."
                : "Qayta urinib ko'ring!"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onExit}
            className="flex-1 rounded-xl"
          >
            Bosh sahifa
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Qaytadan
            <RotateCcw className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!current) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const progressPct = (idx / questions.length) * 100;
  const graded = selected !== null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <audio ref={audioRef} preload="auto" />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          HSK {hskLevel} —{" "}
          {mode === "word" ? "So'z tanish" : "Ohang aniqlash"}
        </p>
        <button
          onClick={onExit}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Chiqish
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {idx + 1} / {questions.length}
          </span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <Progress value={progressPct} className="h-2 rounded-full" />
      </div>

      {/* Audio player card */}
      <div className="rounded-3xl border-2 border-border bg-card p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          {mode === "word"
            ? "Qaysi so'zni eshityapsiz?"
            : "Qaysi ohang eshitildi?"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={togglePlay}
            disabled={loadError}
            className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
            aria-label={playing ? "Pauza" : "O'ynatish"}
          >
            {playing ? (
              <Pause className="w-9 h-9" />
            ) : (
              <Play className="w-9 h-9 ml-1" />
            )}
          </button>
          <button
            onClick={replay}
            disabled={loadError}
            className="w-12 h-12 rounded-full border bg-card flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-40"
            aria-label="Qaytadan"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Speed controls */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => changeSpeed(s)}
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-md transition-colors",
                speed === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {s}x
            </button>
          ))}
        </div>

        {loadError && (
          <p className="text-xs text-red-600">
            Audio yuklanmadi. Qaytadan urinib ko&apos;ring.
          </p>
        )}
      </div>

      {/* Options grid */}
      <div
        className={cn(
          "grid gap-3",
          mode === "word" ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
        )}
      >
        {current.options.map((opt, i) => {
          const isCorrect = i === current.correctIndex;
          const isChosen = selected === i;
          const show = graded;
          return (
            <button
              key={opt + i}
              onClick={() => pick(i)}
              disabled={graded}
              className={cn(
                "relative rounded-2xl border-2 p-6 transition-all min-h-24",
                mode === "word"
                  ? "font-chinese text-4xl"
                  : "font-semibold text-sm",
                !show &&
                  "bg-card hover:border-primary hover:bg-primary/5 cursor-pointer",
                show && isCorrect && "bg-green-500/10 border-green-500",
                show && isChosen && !isCorrect && "bg-red-500/10 border-red-500",
                show && !isChosen && !isCorrect && "opacity-40"
              )}
            >
              {opt}
              {show && isCorrect && (
                <Check className="absolute top-2 right-2 w-5 h-5 text-green-600" />
              )}
              {show && isChosen && !isCorrect && (
                <X className="absolute top-2 right-2 w-5 h-5 text-red-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      <AnimatePresence>
        {graded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl bg-secondary p-4 space-y-1"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-chinese text-2xl">
                {current.clip.transcript_zh}
              </span>
              <span className="pinyin text-sm text-primary">
                {current.clip.transcript_pinyin}
              </span>
            </div>
            <p className="text-sm font-semibold">
              {current.clip.translation_uz}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {graded && (
        <Button
          size="lg"
          onClick={next}
          autoFocus
          className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
        >
          {idx + 1 >= questions.length ? "Yakunlash" : "Keyingi"}
          <ArrowRight className="w-5 h-5 ml-1.5" />
        </Button>
      )}
    </div>
  );
}
