"use client";

import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { lessons, hsk1Vocabulary } from "@/lib/seed-data";
import LessonContent from "@/components/lessons/LessonContent";

interface SingleLessonClientProps {
  lessonId: string;
}

export default function SingleLessonClient({ lessonId }: SingleLessonClientProps) {
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
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-muted-foreground mb-4">Dars topilmadi</p>
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

  if (vocab.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-2xl font-bold mb-2">{lesson.titleUz}</p>
        <p className="text-muted-foreground mb-4">
          Bu dars uchun kontentlar tayyorlanmoqda...
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
        href="/lessons"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Barcha darslar
      </Link>
      <LessonContent lesson={lesson} vocab={vocab} />
    </div>
  );
}
