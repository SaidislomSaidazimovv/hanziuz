"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Undo2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  saveSrsReview,
  getSrsRecord,
  getSrsRecordsBatch,
  type DbVocab,
} from "@/lib/db";
import {
  createNewCard,
  reviewCard,
  type SRSCard,
  type SRSRating,
} from "@/lib/srs-algorithm";
import FlashCard from "@/components/flashcards/FlashCard";
import TypingInput from "./TypingInput";
import type { ReviewMode } from "./FlashcardsEntry";

interface SessionResult {
  vocabId: string;
  hanzi: string;
  rating: SRSRating;
}

interface HistoryEntry {
  vocabId: string;
  prev: SRSCard;
  result: SessionResult;
}

interface Props {
  userId: string;
  vocab: DbVocab[];
  mode: ReviewMode;
  onComplete: (results: SessionResult[]) => void;
}

export default function FlashcardsSession({
  userId,
  vocab,
  mode,
  onComplete,
}: Props) {
  const [deck, setDeck] = useState<SRSCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [busyUndo, setBusyUndo] = useState(false);
  const [loadedStates, setLoadedStates] = useState(false);

  // On mount: hydrate existing SRS state from DB in ONE batch query so "undo" can restore it.
  // Any failure falls back to fresh cards — never leaves the user on a spinner.
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      try {
        const recordMap = await getSrsRecordsBatch(
          userId,
          vocab.map((v) => v.id)
        );
        const cards: SRSCard[] = vocab.map((v) => {
          const rec = recordMap.get(v.id);
          if (!rec) return createNewCard(v.id);
          return {
            vocabId: v.id,
            easeFactor: rec.ease_factor,
            intervalDays: rec.interval_days,
            repetitions: rec.repetitions,
            nextReviewAt: new Date(rec.next_review_at),
            lastReviewedAt: null,
          };
        });
        if (!cancelled) setDeck(cards);
      } catch {
        if (!cancelled) setDeck(vocab.map((v) => createNewCard(v.id)));
      } finally {
        if (!cancelled) setLoadedStates(true);
      }
    }
    hydrate();
    return () => {
      cancelled = true;
    };
  }, [userId, vocab]);

  const currentCard = deck[currentIdx];
  const currentWord = vocab.find((v) => v.id === currentCard?.vocabId);
  const remaining = deck.length - currentIdx;
  const progressPct = deck.length > 0 ? (currentIdx / deck.length) * 100 : 0;

  const handleRating = useCallback(
    (rating: SRSRating) => {
      if (!currentCard || !currentWord) return;

      const prev: SRSCard = { ...currentCard };
      const result = reviewCard(currentCard, rating);

      setDeck((p) =>
        p.map((c) =>
          c.vocabId === currentCard.vocabId
            ? { ...c, ...result, lastReviewedAt: new Date() }
            : c
        )
      );

      setHistory((h) => [
        ...h,
        {
          vocabId: currentCard.vocabId,
          prev,
          result: {
            vocabId: currentWord.id,
            hanzi: currentWord.hanzi,
            rating,
          },
        },
      ]);

      // Persist. On "again", fetch current lapses and increment.
      // On "good"/"hard", leave lapses alone (upsert without lapses field).
      if (userId) {
        (async () => {
          if (rating === "again") {
            const rec = await getSrsRecord(userId, currentCard.vocabId);
            const nextLapses = (rec?.lapses ?? 0) + 1;
            saveSrsReview(
              userId,
              currentCard.vocabId,
              result.easeFactor,
              result.intervalDays,
              result.repetitions,
              result.nextReviewAt,
              nextLapses
            );
          } else {
            saveSrsReview(
              userId,
              currentCard.vocabId,
              result.easeFactor,
              result.intervalDays,
              result.repetitions,
              result.nextReviewAt
            );
          }
        })();
      }

      if (currentIdx < deck.length - 1) {
        setCurrentIdx((i) => i + 1);
        setIsFlipped(false);
      } else {
        // Session done
        const results = [
          ...history.map((h) => h.result),
          {
            vocabId: currentWord.id,
            hanzi: currentWord.hanzi,
            rating,
          },
        ];
        onComplete(results);
      }
    },
    [currentCard, currentWord, currentIdx, deck.length, history, onComplete, userId]
  );

  const handleUndo = useCallback(async () => {
    if (history.length === 0 || busyUndo) return;
    setBusyUndo(true);
    try {
      const last = history[history.length - 1];
      // Restore deck state
      setDeck((p) =>
        p.map((c) => (c.vocabId === last.vocabId ? last.prev : c))
      );
      setHistory((h) => h.slice(0, -1));
      setCurrentIdx((i) => Math.max(0, i - 1));
      setIsFlipped(false);
      // Revert DB to previous state (omit lapses — can't safely restore count)
      if (userId) {
        await saveSrsReview(
          userId,
          last.prev.vocabId,
          last.prev.easeFactor,
          last.prev.intervalDays,
          last.prev.repetitions,
          last.prev.nextReviewAt
        );
      }
    } finally {
      setBusyUndo(false);
    }
  }, [history, busyUndo, userId]);

  // Keyboard shortcuts (classic mode only — typing mode owns the keyboard)
  const handleRatingRef = useRef(handleRating);
  const handleUndoRef = useRef(handleUndo);
  handleRatingRef.current = handleRating;
  handleUndoRef.current = handleUndo;

  useEffect(() => {
    if (mode !== "classic") return;
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === " ") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (isFlipped) {
        if (e.key === "1") handleRatingRef.current("again");
        else if (e.key === "2") handleRatingRef.current("hard");
        else if (e.key === "3") handleRatingRef.current("good");
      }
      if (e.key === "z" || e.key === "Z" || e.key === "Backspace") {
        handleUndoRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, isFlipped]);

  if (!loadedStates) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{remaining}</span> ta qoldi
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={history.length === 0 || busyUndo}
          className="rounded-lg"
          title="Oldingi baholashni bekor qilish (Z)"
        >
          <Undo2 className="w-4 h-4 mr-1.5" />
          Bekor qilish
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {currentIdx + 1} / {deck.length}
          </span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <Progress value={progressPct} className="h-2 rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          {mode === "classic" ? (
            <FlashCard word={currentWord} onFlip={setIsFlipped} />
          ) : (
            <TypingInput word={currentWord} onGrade={handleRating} />
          )}
        </motion.div>
      </AnimatePresence>

      {mode === "classic" && (
        <>
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                className="grid grid-cols-3 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
              >
                <RatingBtn
                  onClick={() => handleRating("again")}
                  color="red"
                  icon={<XCircle className="w-6 h-6 text-red-500" />}
                  label="Bilmayman"
                  shortcut="1"
                />
                <RatingBtn
                  onClick={() => handleRating("hard")}
                  color="amber"
                  icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
                  label="Qiyin"
                  shortcut="2"
                />
                <RatingBtn
                  onClick={() => handleRating("good")}
                  color="green"
                  icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
                  label="Bilaman"
                  shortcut="3"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!isFlipped && (
            <p className="text-center text-xs text-muted-foreground">
              Kartochkani bosing yoki{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-secondary">Space</kbd> —
              tarjimasini ko&apos;rish uchun
            </p>
          )}
        </>
      )}
    </div>
  );
}

function RatingBtn({
  onClick,
  color,
  icon,
  label,
  shortcut,
}: {
  onClick: () => void;
  color: "red" | "amber" | "green";
  icon: React.ReactNode;
  label: string;
  shortcut: string;
}) {
  const colorClass = {
    red: "bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 text-red-600",
    amber:
      "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40 text-amber-600",
    green:
      "bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40 text-green-600",
  }[color];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 p-4 rounded-2xl border transition-all",
        colorClass
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
      <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
        {shortcut}
      </kbd>
    </button>
  );
}
