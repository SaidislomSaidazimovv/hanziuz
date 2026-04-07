"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Flame,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { hsk1Vocabulary } from "@/lib/seed-data";
import {
  createNewCard,
  reviewCard,
  type SRSCard,
  type SRSRating,
} from "@/lib/srs-algorithm";
import FlashCard from "@/components/flashcards/FlashCard";
import Link from "next/link";

interface SessionResult {
  vocabId: string;
  hanzi: string;
  rating: SRSRating;
}

export default function FlashcardsClient() {
  // Build initial SRS deck from vocab
  const initialDeck = useMemo(
    () => hsk1Vocabulary.slice(0, 15).map((v) => createNewCard(v.id)),
    []
  );

  const [deck, setDeck] = useState<SRSCard[]>(initialDeck);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [sessionDone, setSessionDone] = useState(false);

  const currentCard = deck[currentIdx];
  const currentWord = hsk1Vocabulary.find(
    (v) => v.id === currentCard?.vocabId
  );
  const remaining = deck.length - currentIdx;
  const progressPct = (currentIdx / deck.length) * 100;

  const handleRating = useCallback(
    (rating: SRSRating) => {
      if (!currentCard || !currentWord) return;

      // Update SRS state
      const result = reviewCard(currentCard, rating);
      setDeck((prev) =>
        prev.map((c) =>
          c.vocabId === currentCard.vocabId
            ? {
                ...c,
                ...result,
                lastReviewedAt: new Date(),
              }
            : c
        )
      );

      // Record result
      setSessionResults((prev) => [
        ...prev,
        { vocabId: currentWord.id, hanzi: currentWord.hanzi, rating },
      ]);

      // Advance or finish
      if (currentIdx < deck.length - 1) {
        setCurrentIdx((i) => i + 1);
        setIsFlipped(false);
      } else {
        setSessionDone(true);
      }
    },
    [currentCard, currentWord, currentIdx, deck.length]
  );

  const restartSession = () => {
    setDeck(initialDeck.map((c) => createNewCard(c.vocabId)));
    setCurrentIdx(0);
    setIsFlipped(false);
    setSessionResults([]);
    setSessionDone(false);
  };

  const goodCount = sessionResults.filter((r) => r.rating === "good").length;
  const hardCount = sessionResults.filter((r) => r.rating === "hard").length;
  const againCount = sessionResults.filter((r) => r.rating === "again").length;

  // Session complete screen
  if (sessionDone) {
    const totalCards = sessionResults.length;
    const scorePct = Math.round((goodCount / totalCards) * 100);

    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          className="rounded-3xl border bg-card p-8 text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-green-500" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Mashg&apos;ulot yakunlandi!</h2>
            <p className="text-muted-foreground mt-1">
              {totalCards} ta kartochka takrorlandi
            </p>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-green-500/10 p-3 text-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">{goodCount}</p>
              <p className="text-xs text-muted-foreground">Bilaman</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-3 text-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-amber-600">{hardCount}</p>
              <p className="text-xs text-muted-foreground">Qiyin</p>
            </div>
            <div className="rounded-xl bg-red-500/10 p-3 text-center">
              <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-600">{againCount}</p>
              <p className="text-xs text-muted-foreground">Bilmayman</p>
            </div>
          </div>

          <div className="rounded-xl bg-secondary p-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Natija</span>
            </div>
            <p className="text-3xl font-bold text-primary">{scorePct}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {scorePct >= 80
                ? "Ajoyib natija!"
                : scorePct >= 50
                  ? "Yaxshi! Davom eting."
                  : "Takrorlash kerak. Qaytadan urinib ko'ring!"}
            </p>
          </div>

          {/* Cards that need review */}
          {againCount > 0 && (
            <div className="text-left">
              <p className="text-sm font-medium mb-2">
                Takrorlash kerak bo&apos;lgan so&apos;zlar:
              </p>
              <div className="flex flex-wrap gap-2">
                {sessionResults
                  .filter((r) => r.rating === "again")
                  .map((r) => (
                    <span
                      key={r.vocabId}
                      className="px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg text-sm font-chinese"
                    >
                      {r.hanzi}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={restartSession}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Qaytadan
            </Button>
            <Button
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              render={<Link href="/dashboard" />}
            >
              Boshqaruv paneli
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold">Kartochkalar</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{remaining}</span> ta
          qoldi
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {currentIdx + 1} / {deck.length}
          </span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <Progress value={progressPct} className="h-2 rounded-full" />
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          <FlashCard word={currentWord} onFlip={setIsFlipped} />
        </motion.div>
      </AnimatePresence>

      {/* Rating buttons — only visible when flipped */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => handleRating("again")}
              className={cn(
                "flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all",
                "bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40"
              )}
            >
              <XCircle className="w-6 h-6 text-red-500" />
              <span className="text-sm font-semibold text-red-600">
                Bilmayman
              </span>
              <span className="text-[10px] text-muted-foreground">
                Qayta ko&apos;rish
              </span>
            </button>

            <button
              onClick={() => handleRating("hard")}
              className={cn(
                "flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all",
                "bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10 hover:border-amber-500/40"
              )}
            >
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <span className="text-sm font-semibold text-amber-600">
                Qiyin
              </span>
              <span className="text-[10px] text-muted-foreground">
                Tez takrorlash
              </span>
            </button>

            <button
              onClick={() => handleRating("good")}
              className={cn(
                "flex flex-col items-center gap-1.5 p-4 rounded-2xl border transition-all",
                "bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40"
              )}
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <span className="text-sm font-semibold text-green-600">
                Bilaman
              </span>
              <span className="text-[10px] text-muted-foreground">
                Keyinroq
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint when not flipped */}
      {!isFlipped && (
        <p className="text-center text-sm text-muted-foreground">
          Kartochkani bosib tarjimani ko&apos;ring, keyin baholang
        </p>
      )}
    </div>
  );
}
