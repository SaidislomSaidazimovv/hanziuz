"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, Loader2, RotateCcw } from "lucide-react";
import type { VocabWord } from "@/lib/seed-data";

interface FlashCardProps {
  word: VocabWord;
  onFlip?: (flipped: boolean) => void;
}

export default function FlashCard({ word, onFlip }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFlip = () => {
    const next = !flipped;
    setFlipped(next);
    onFlip?.(next);
  };

  const speak = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSpeaking) return;
      setIsSpeaking(true);
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(word.hanzi);
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
    [word.hanzi, isSpeaking]
  );

  // Reset flip when word changes
  const [prevWord, setPrevWord] = useState(word.id);
  if (word.id !== prevWord) {
    setPrevWord(word.id);
    setFlipped(false);
  }

  return (
    <div
      onClick={handleFlip}
      className="relative cursor-pointer w-full max-w-sm mx-auto select-none"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative w-full min-h-[320px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-border bg-card shadow-lg flex flex-col items-center justify-center p-8"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="hanzi-display text-7xl sm:text-8xl mb-4">
            {word.hanzi}
          </span>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={speak}
              disabled={isSpeaking}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              aria-label="Tinglash"
            >
              {isSpeaking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-6 flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Tarjimasini ko&apos;rish uchun bosing
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl border-2 border-primary/30 bg-card shadow-lg flex flex-col items-center justify-center p-8"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="hanzi-display text-4xl text-muted-foreground mb-2">
            {word.hanzi}
          </span>
          <p className="pinyin text-xl text-primary mb-3">{word.pinyin}</p>
          <p className="text-3xl font-bold mb-1">{word.meaningUz}</p>
          <p className="text-sm text-muted-foreground">{word.meaningEn}</p>

          {word.exampleZh && (
            <div className="mt-6 p-3 rounded-xl bg-secondary/50 text-left w-full">
              <p className="font-chinese text-sm">{word.exampleZh}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {word.exampleUz}
              </p>
            </div>
          )}

          <button
            onClick={speak}
            disabled={isSpeaking}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            {isSpeaking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            Tinglash
          </button>
        </div>
      </motion.div>
    </div>
  );
}
