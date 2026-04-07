"use client";

import { useState, useEffect } from "react";
import { Brain, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getLessons, type DbLesson } from "@/lib/db";

export default function QuizListClient() {
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLessons().then((data) => {
      setLessons(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

      <div className="grid gap-3">
        {lessons.map((lesson, i) => (
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
                  {lesson.title_zh?.slice(0, 2) || "学"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                    HSK {lesson.hsk_level}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    +{lesson.xp_reward} XP
                  </span>
                </div>
                <h3 className="font-semibold text-sm truncate">
                  {lesson.title_uz}
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
