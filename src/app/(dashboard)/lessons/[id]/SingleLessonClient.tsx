"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { getLesson, getLessonVocab, type DbLesson, type DbVocab } from "@/lib/db";
import LessonContent from "@/components/lessons/LessonContent";

interface SingleLessonClientProps {
  lessonId: string;
}

export default function SingleLessonClient({ lessonId }: SingleLessonClientProps) {
  const [lesson, setLesson] = useState<DbLesson | null>(null);
  const [vocab, setVocab] = useState<DbVocab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getLesson(lessonId), getLessonVocab(lessonId)]).then(
      ([l, v]) => {
        setLesson(l);
        setVocab(v);
        setLoading(false);
      }
    );
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        <p className="text-2xl font-bold mb-2">{lesson.title_uz}</p>
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
