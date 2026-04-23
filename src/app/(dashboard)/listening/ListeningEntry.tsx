"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Ear,
  Headphones,
  Volume2,
  Music,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ListeningMode } from "@/lib/db/listening";
import type { UserListeningProgress } from "./ListeningClient";

const HSK_LEVELS = [1, 2, 3, 4];

export default function ListeningEntry({
  totalClips,
  clipsPerLevel,
  userProgress,
  onStart,
  errorMsg,
}: {
  totalClips: number;
  clipsPerLevel: Record<number, number>;
  userProgress: UserListeningProgress;
  onStart: (hskLevel: number, mode: ListeningMode) => void;
  errorMsg: string | null;
}) {
  const [mode, setMode] = useState<ListeningMode>("word");

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Headphones className="w-7 h-7 text-primary" />
          Tinglash
        </h1>
        <p className="text-muted-foreground mt-1">
          Xitoycha audio bilan quloq mashq qiling
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      {/* Stats row: total library + personal progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border bg-card p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Ear className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold">
              {totalClips.toLocaleString("uz-UZ")}
            </p>
            <p className="text-xs text-muted-foreground">
              jami audio kartochka
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold">
              {userProgress.attemptedClips.toLocaleString("uz-UZ")}
            </p>
            <p className="text-xs text-muted-foreground">
              siz eshitgan so&apos;zlar
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold">
              {userProgress.totalAttempts > 0
                ? `${userProgress.accuracyPct}%`
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              aniqligingiz
            </p>
          </div>
        </div>
      </div>

      {/* Mode picker */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Mashg&apos;ulot turi
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("word")}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors flex items-start gap-3",
              mode === "word"
                ? "border-primary bg-primary/10"
                : "bg-card hover:bg-secondary/50"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                mode === "word"
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">So&apos;z tanish</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Eshiting va to&apos;g&apos;ri ierogifni tanlang
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode("tone")}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors flex items-start gap-3",
              mode === "tone"
                ? "border-primary bg-primary/10"
                : "bg-card hover:bg-secondary/50"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                mode === "tone"
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              <Music className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Ohang aniqlash</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Qaysi ohang (1-4) ekanini toping
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* HSK level picker */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          HSK darajasini tanlang
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HSK_LEVELS.map((level) => {
            const count = clipsPerLevel[level] ?? 0;
            const disabled = count === 0;
            return (
              <button
                key={level}
                onClick={() => !disabled && onStart(level, mode)}
                disabled={disabled}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  disabled
                    ? "opacity-40 cursor-not-allowed bg-card"
                    : "bg-card hover:border-primary hover:bg-primary/5 cursor-pointer"
                )}
              >
                <p className="text-lg font-bold">HSK {level}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {count > 0 ? `${count} ta audio` : "Audio yo'q"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <h3 className="font-semibold text-sm mb-2">Qanday ishlaydi?</h3>
        {mode === "word" ? (
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal pl-4">
            <li>Har bir savolda xitoycha so&apos;z eshitiladi</li>
            <li>4 ta ierogifdan to&apos;g&apos;ri javobni tanlang</li>
            <li>Audioni xohlagancha qayta eshitishingiz mumkin</li>
            <li>Tezlikni sozlash mumkin (0.75x / 1x / 1.5x)</li>
          </ol>
        ) : (
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal pl-4">
            <li>Bir bo&apos;g&apos;inli so&apos;z audiosi eshitiladi</li>
            <li>4 ta ohangdan to&apos;g&apos;risini toping (↗ 1, ↘ 2, ↔ 3, ↘ 4)</li>
            <li>Xitoy tilining eng muhim qismi — aniqlik juda muhim</li>
            <li>Qayta eshitish va sekinlatish imkoniyati bor</li>
          </ol>
        )}
      </div>

      <Button
        size="lg"
        onClick={() => onStart(1, mode)}
        disabled={totalClips === 0}
        className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
      >
        {totalClips === 0
          ? "Audio kartochkalar yuklanmagan"
          : "HSK 1 dan boshlash"}
      </Button>
    </motion.div>
  );
}
