"use client";

import { useEffect, useRef, useState } from "react";

interface HanziStrokeProps {
  character: string;
  size?: number;
}

export default function HanziStroke({ character, size = 200 }: HanziStrokeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<import("hanzi-writer").default | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      writerRef.current = null;

      const HanziWriter = (await import("hanzi-writer")).default;
      if (cancelled || !containerRef.current) return;

      const writer = HanziWriter.create(containerRef.current, character, {
        width: size,
        height: size,
        padding: 5,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        strokeColor: "#333333",
        radicalColor: "#DC2626",
        outlineColor: "#3f3f46",
        drawingColor: "#ffffff",
        showHintAfterMisses: 2,
      });

      writerRef.current = writer;
    }

    init();
    return () => {
      cancelled = true;
      writerRef.current = null;
    };
  }, [character, size]);

  const handleAnimate = () => {
    if (!writerRef.current || isAnimating) return;
    setIsAnimating(true);
    if (isQuizMode) {
      writerRef.current.cancelQuiz();
      setIsQuizMode(false);
    }
    writerRef.current.animateCharacter({
      onComplete: () => setIsAnimating(false),
    });
  };

  const handleQuiz = () => {
    if (!writerRef.current) return;

    if (isQuizMode) {
      writerRef.current.cancelQuiz();
      setIsQuizMode(false);
      return;
    }

    setIsQuizMode(true);
    writerRef.current.quiz({
      onMistake: (strokeData) => {
        console.log("Mistake on stroke", strokeData.strokeNum);
      },
      onCorrectStroke: (strokeData) => {
        console.log("Correct stroke", strokeData.strokeNum);
      },
      onComplete: () => {
        setIsQuizMode(false);
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="border-2 border-dashed border-border rounded-2xl"
        style={{ width: size, height: size }}
      />
      {isQuizMode && (
        <p className="text-xs text-muted-foreground">
          Harfni ekranda chizing
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleAnimate}
          disabled={isAnimating}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isAnimating ? "Animatsiya..." : "Animatsiya"}
        </button>
        <button
          onClick={handleQuiz}
          className="px-4 py-2 text-sm font-medium rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          {isQuizMode ? "Bekor qilish" : "Yozib ko\u2019ring"}
        </button>
      </div>
    </div>
  );
}
