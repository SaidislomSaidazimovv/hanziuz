"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Flame,
  Trophy,
  Loader2,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user-context";
import {
  getFlashcardsFiltered,
  addXP,
  createNotification,
  type DbVocab,
  type FlashcardFilter,
} from "@/lib/db";
import type { SRSRating } from "@/lib/srs-algorithm";
import Link from "next/link";
import FlashcardsEntry, { type ReviewMode } from "./FlashcardsEntry";
import FlashcardsSession from "./FlashcardsSession";

type Screen = "entry" | "loading" | "empty" | "session" | "done";

interface SessionResult {
  vocabId: string;
  hanzi: string;
  rating: SRSRating;
}

export default function FlashcardsClient() {
  const { id: userId } = useUser();
  const [screen, setScreen] = useState<Screen>("entry");
  const [deckVocab, setDeckVocab] = useState<DbVocab[]>([]);
  const [mode, setMode] = useState<ReviewMode>("classic");
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [lastFilter, setLastFilter] = useState<FlashcardFilter | null>(null);

  const [loadError, setLoadError] = useState<string | null>(null);

  const handleStart = useCallback(
    async (filter: FlashcardFilter, selectedMode: ReviewMode) => {
      if (!userId) return;
      setLoadError(null);
      setScreen("loading");
      setMode(selectedMode);
      setLastFilter(filter);
      try {
        const vocab = await getFlashcardsFiltered(userId, filter);
        if (vocab.length === 0) {
          setScreen("empty");
          return;
        }
        setDeckVocab(vocab);
        setSessionResults([]);
        setScreen("session");
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "Kartochkalarni yuklab bo'lmadi"
        );
        setScreen("entry");
      }
    },
    [userId]
  );

  const handleComplete = useCallback(
    (results: SessionResult[]) => {
      setSessionResults(results);
      setScreen("done");
      if (userId) {
        addXP(userId, 10);
        createNotification(
          userId,
          "flashcards_due",
          "Kartochkalar takrorlandi!",
          `${results.length} ta kartochka takrorlandi. +10 XP`,
          "/flashcards"
        );
      }
    },
    [userId]
  );

  const handleBackToEntry = useCallback(() => {
    setScreen("entry");
    setDeckVocab([]);
    setSessionResults([]);
  }, []);

  const handleRestart = useCallback(() => {
    if (lastFilter) handleStart(lastFilter, mode);
  }, [lastFilter, mode, handleStart]);

  if (!userId) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (screen === "entry") {
    return (
      <>
        {loadError && (
          <div className="max-w-3xl mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-600">
            {loadError}
          </div>
        )}
        <FlashcardsEntry userId={userId} onStart={handleStart} />
      </>
    );
  }

  if (screen === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (screen === "empty") {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Bu deckda kartochka yo&apos;q</h2>
        <p className="text-muted-foreground mb-4">
          Boshqa filtr tanlang yoki avval darslarni o&apos;rganing.
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={handleBackToEntry}
            className="rounded-xl"
          >
            Orqaga
          </Button>
          <Button
            render={<Link href="/lessons" />}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Darslarga o&apos;tish
          </Button>
        </div>
      </div>
    );
  }

  if (screen === "session") {
    return (
      <FlashcardsSession
        userId={userId}
        vocab={deckVocab}
        mode={mode}
        onComplete={handleComplete}
      />
    );
  }

  // Session done screen
  const goodCount = sessionResults.filter((r) => r.rating === "good").length;
  const hardCount = sessionResults.filter((r) => r.rating === "hard").length;
  const againCount = sessionResults.filter((r) => r.rating === "again").length;
  const totalCards = sessionResults.length || 1;
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
          <h2 className="text-2xl font-bold">
            Mashg&apos;ulot yakunlandi!
          </h2>
          <p className="text-muted-foreground mt-1">
            {sessionResults.length} ta kartochka takrorlandi
          </p>
        </div>

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

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleRestart}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Qaytadan
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleBackToEntry}
          >
            Boshqa deck
          </Button>
          <Button
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            render={<Link href="/dashboard" />}
          >
            Bosh sahifa
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
