"use client";

import { Brain, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { lessons, hsk1Vocabulary } from "@/lib/seed-data";
import { cn } from "@/lib/utils";

export default function QuizListClient() {
  // Only lessons with 4+ vocab words can have quizzes
  const quizLessons = lessons.filter((l) => {
    const vocabCount = l.vocabIds.filter((id) =>
      hsk1Vocabulary.some((v) => v.id === id)
    ).length;
    return vocabCount >= 4;
  });

  const lockedLessons = lessons.filter((l) => {
    const vocabCount = l.vocabIds.filter((id) =>
      hsk1Vocabulary.some((v) => v.id === id)
    ).length;
    return vocabCount < 4 && vocabCount > 0;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Testlar</h1>
        </div>
        <p className="text-muted-foreground">
          Darslar bo&apos;yicha bilimingizni sinab ko&apos;ring
        </p>
      </div>

      {/* Available quizzes */}
      <div className="grid gap-3">
        {quizLessons.map((lesson, i) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={`/quiz/${lesson.id}`}
              className="group flex items-center gap-4 p-5 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <span className="hanzi-display text-2xl text-primary">
                  {lesson.hanziPreview}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                    HSK {lesson.hskLevel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lesson.vocabIds.length} ta savol · +{lesson.xpReward} XP
                  </span>
                </div>
                <h3 className="font-semibold text-sm truncate">
                  {lesson.titleUz}
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Locked quizzes */}
      {lockedLessons.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">Tez kunda</p>
          <div className="grid gap-3">
            {lockedLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border bg-card opacity-50 cursor-not-allowed"
                )}
              >
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {lesson.titleUz}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Yetarli so&apos;zlar yo&apos;q
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
