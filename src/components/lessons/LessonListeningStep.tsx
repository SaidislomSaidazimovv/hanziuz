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
  Loader2,
  Gauge,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import {
  getListeningClipsByHanzi,
  recordListeningAttempt,
  type ListeningClip,
} from "@/lib/db/listening";
import type { DbVocab } from "@/lib/db";

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

function buildQuestions(pool: ListeningClip[]): Question[] {
  const shuffled = shuffle(pool);
  return shuffled.map((clip) => {
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

export default function LessonListeningStep({
  vocab,
  onComplete,
}: {
  vocab: DbVocab[];
  onComplete: () => void;
}) {
  const { id: userId } = useUser();
  const [clips, setClips] = useState<ListeningClip[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);

  const questions = useMemo(
    () => (clips ? buildQuestions(clips) : []),
    [clips]
  );
  const current = questions[idx];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const hanziList = vocab.map((v) => v.hanzi);
        const fetched = await getListeningClipsByHanzi(hanziList);
        if (!cancelled) {
          setClips(fetched);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setClips([]);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [vocab]);

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
    if (selected !== null || !current) return;
    setSelected(i);
    const correct = i === current.correctIndex;
    setResults((prev) => [...prev, correct]);
    if (userId) {
      recordListeningAttempt(userId, current.clip.id, "word", correct).catch(
        () => {
          /* non-blocking */
        }
      );
    }
  }

  function next() {
    if (idx + 1 >= questions.length) {
      onComplete();
      return;
    }
    setIdx(idx + 1);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // No clips OR fewer than 4 (can't form 4-option question) — allow skip
  if (!clips || clips.length < 4) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Bu dars uchun yetarli audio kartochka topilmadi. Keyingi bosqichga
          o&apos;tishingiz mumkin.
        </p>
        <Button
          onClick={onComplete}
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <SkipForward className="w-4 h-4 mr-1.5" />
          O&apos;tkazib yuborish
        </Button>
      </div>
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
  const correctCount = results.filter(Boolean).length;

  return (
    <div className="space-y-6">
      <audio ref={audioRef} preload="auto" />

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {idx + 1} / {questions.length} — Tinglash
          </span>
          <span>
            {correctCount} / {idx + (graded ? 1 : 0)} to&apos;g&apos;ri
          </span>
        </div>
        <Progress value={progressPct} className="h-1.5 rounded-full" />
      </div>

      <div className="rounded-3xl border-2 border-border bg-card p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Qaysi so&apos;zni eshityapsiz?
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

      <div className="grid grid-cols-2 gap-3">
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
                "relative rounded-2xl border-2 p-6 transition-all font-chinese text-4xl min-h-24",
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
          className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base"
        >
          {idx + 1 >= questions.length ? "Yakunlash" : "Keyingi"}
          <ArrowRight className="w-5 h-5 ml-1.5" />
        </Button>
      )}
    </div>
  );
}
