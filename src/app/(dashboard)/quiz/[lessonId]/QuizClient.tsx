"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Brain, Loader2 } from "lucide-react";
import Link from "next/link";
import { getLesson, getLessonVocab, getAllVocab, type DbLesson, type DbVocab } from "@/lib/db";
import QuizComponent from "@/components/quiz/QuizComponent";

interface QuizClientProps {
  lessonId: string;
}

export default function QuizClient({ lessonId }: QuizClientProps) {
  const [lesson, setLesson] = useState<DbLesson | null>(null);
  const [vocab, setVocab] = useState<DbVocab[]>([]);
  const [allVocab, setAllVocab] = useState<DbVocab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getLesson(lessonId),
      getLessonVocab(lessonId),
      getAllVocab(),
    ]).then(([l, v, av]) => {
      setLesson(l);
      setVocab(v);
      setAllVocab(av);
      setLoading(false);
    });
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
        <p className="text-lg font-semibold mb-2">{lesson.title_uz}</p>
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
      <QuizComponent lesson={lesson} vocab={vocab} allVocab={allVocab} />
    </div>
  );
}
