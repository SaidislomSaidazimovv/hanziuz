"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RecommendedLessonProps {
  title: string;
  lessonId: string;
  hskLevel: number;
  description: string;
  hanziPreview: string;
  xpReward: number;
}

export default function RecommendedLesson({
  title,
  lessonId,
  hskLevel,
  description,
  hanziPreview,
  xpReward,
}: RecommendedLessonProps) {
  return (
    <motion.div
      className="rounded-2xl border bg-card p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-accent" />
        <h3 className="font-semibold text-sm">Tavsiya etilgan dars</h3>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
          <span className="hanzi-display text-3xl text-accent">
            {hanziPreview}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-md">
              HSK {hskLevel}
            </span>
            <span className="text-xs text-muted-foreground">+{xpReward} XP</span>
          </div>
          <h4 className="font-semibold truncate">{title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 rounded-xl"
        render={<Link href={`/lessons/${lessonId}`} />}
      >
        Darsni boshlash
        <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </motion.div>
  );
}
