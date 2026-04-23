"use client";

import { motion } from "framer-motion";
import { Ear, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HSK_LEVELS = [1, 2, 3, 4];

export default function ListeningEntry({
  totalClips,
  clipsPerLevel,
  onStart,
  errorMsg,
}: {
  totalClips: number;
  clipsPerLevel: Record<number, number>;
  onStart: (hskLevel: number) => void;
  errorMsg: string | null;
}) {
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

      <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Ear className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">
            {totalClips.toLocaleString("uz-UZ")}
          </p>
          <p className="text-xs text-muted-foreground">
            jami audio kartochka
          </p>
        </div>
      </div>

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
                onClick={() => !disabled && onStart(level)}
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
        <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal pl-4">
          <li>Har bir savolda xitoycha so&apos;z eshitiladi</li>
          <li>4 ta ierogifdan to&apos;g&apos;ri javobni tanlang</li>
          <li>Audioni xohlagancha qayta eshitishingiz mumkin</li>
          <li>10 ta savoldan iborat mashg&apos;ulot</li>
        </ol>
      </div>

      <Button
        size="lg"
        onClick={() => onStart(1)}
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
