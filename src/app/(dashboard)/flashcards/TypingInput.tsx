"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DbVocab } from "@/lib/db";
import type { SRSRating } from "@/lib/srs-algorithm";

// Strip diacritics (tone marks on pinyin, etc.)
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''ʼ`]/g, "")
    .replace(/\s+/g, " ");
}

// Levenshtein distance — used to grade "near-misses" as hard, not wrong
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev: number[] = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let prevDiag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] =
        a[i - 1] === b[j - 1]
          ? prevDiag
          : 1 + Math.min(prev[j - 1], prev[j], prevDiag);
      prevDiag = temp;
    }
  }
  return prev[b.length];
}

function gradeAnswer(input: string, word: DbVocab): SRSRating {
  const normInput = normalize(input);
  if (!normInput) return "again";

  const candidates: string[] = [];
  for (const field of [word.meaning_uz, word.meaning_en, word.pinyin]) {
    if (!field) continue;
    // Split on " / " and "," to accept "Ish / Ishlamoq" style alternatives
    for (const part of field.split(/[/,]/)) {
      const normPart = normalize(part);
      if (normPart) candidates.push(normPart);
    }
  }

  // Exact match on any candidate → good
  if (candidates.includes(normInput)) return "good";

  // Near miss (distance ≤ 2 on any candidate) → hard
  for (const c of candidates) {
    if (c.length >= 3 && editDistance(c, normInput) <= 2) return "hard";
  }

  return "again";
}

interface Props {
  word: DbVocab;
  onGrade: (rating: SRSRating) => void;
}

export default function TypingInput({ word, onGrade }: Props) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<SRSRating | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on word change
  useEffect(() => {
    setAnswer("");
    setResult(null);
    setHintShown(false);
    inputRef.current?.focus();
  }, [word.id]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (result) {
      // Already graded — next
      onGrade(result);
      return;
    }
    const grade = hintShown
      ? ("hard" as SRSRating)
      : gradeAnswer(answer, word);
    setResult(grade);
  }

  function handleHint() {
    setHintShown(true);
  }

  function handleGiveUp() {
    setResult("again");
  }

  const graded = result !== null;

  return (
    <div className="max-w-sm mx-auto w-full space-y-4">
      <div className="rounded-3xl border-2 border-border bg-card p-8 text-center shadow-lg">
        <span className="hanzi-display text-7xl sm:text-8xl">{word.hanzi}</span>
        {hintShown && (
          <p className="pinyin text-lg text-primary mt-4">{word.pinyin}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          ref={inputRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="O'zbekcha yoki pinyin yozing..."
          disabled={graded}
          className="text-center text-base h-12 rounded-xl"
          autoFocus
        />

        {!graded ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleHint}
              disabled={hintShown}
              className="rounded-xl"
            >
              <Lightbulb className="w-4 h-4 mr-1.5" />
              Ko&apos;rsatma
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleGiveUp}
              className="rounded-xl"
            >
              Bilmayman
            </Button>
            <Button
              type="submit"
              disabled={!answer.trim()}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Tekshirish
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            autoFocus
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Keyingi
          </Button>
        )}
      </form>

      {graded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={
            result === "good"
              ? "rounded-2xl bg-green-500/10 border border-green-500/30 p-4"
              : result === "hard"
                ? "rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4"
                : "rounded-2xl bg-red-500/10 border border-red-500/30 p-4"
          }
        >
          <div className="flex items-center gap-2 mb-2">
            {result === "good" ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">To&apos;g&apos;ri!</span>
              </>
            ) : result === "hard" ? (
              <>
                <Check className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-600">
                  Yaqin — deyarli to&apos;g&apos;ri
                </span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-600">Noto&apos;g&apos;ri</span>
              </>
            )}
          </div>
          <p className="pinyin text-sm text-muted-foreground">{word.pinyin}</p>
          <p className="text-base font-semibold">{word.meaning_uz}</p>
          {word.example_sentence_zh && (
            <p className="font-chinese text-sm mt-2">
              {word.example_sentence_zh}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
