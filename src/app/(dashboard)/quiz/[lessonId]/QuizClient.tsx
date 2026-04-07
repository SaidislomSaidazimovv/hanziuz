"use client";

import { useMemo } from "react";
import { ArrowLeft, Brain } from "lucide-react";
import Link from "next/link";
import { lessons, hsk1Vocabulary } from "@/lib/seed-data";
import QuizComponent from "@/components/quiz/QuizComponent";

interface QuizClientProps {
  lessonId: string;
}

export default function QuizClient({ lessonId }: QuizClientProps) {
  const lesson = useMemo(
    () => lessons.find((l) => l.id === lessonId),
    [lessonId]
  );

  const vocab = useMemo(() => {
    if (!lesson) return [];
    return lesson.vocabIds
      .map((id) => hsk1Vocabulary.find((v) => v.id === id))
      .filter(Boolean) as typeof hsk1Vocabulary;
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-muted-foreground mb-4">Test topilmadi</p>
        <Link
          href="/lessons"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Darslarga qaytish
        </Link>
      </div>
    );
  }

  if (vocab.length < 4) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-semibold mb-2">{lesson.titleUz}</p>
        <p className="text-muted-foreground mb-4">
          Bu dars uchun test tayyorlanmoqda...
        </p>
        <Link
          href="/lessons"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Darslarga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/lessons/${lessonId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Darsga qaytish
      </Link>
      <QuizComponent
        lesson={lesson}
        vocab={vocab}
        allVocab={hsk1Vocabulary}
      />
    </div>
  );
}
