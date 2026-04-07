"use client";

import { motion } from "framer-motion";
import { Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface ContinueLearningCardProps {
  lessonTitle: string;
  lessonId: string;
  hskLevel: number;
  progress: number;
  hanziPreview: string;
}

export default function ContinueLearningCard({
  lessonTitle,
  lessonId,
  hskLevel,
  progress,
  hanziPreview,
}: ContinueLearningCardProps) {
  return (
    <motion.div
      className="rounded-2xl border bg-gradient-to-br from-primary/5 to-accent/5 p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <BookOpen className="w-4 h-4" />
        <span>Davom ettiring</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-card border flex items-center justify-center shrink-0">
          <span className="hanzi-display text-4xl text-primary">
            {hanziPreview}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
              HSK {hskLevel}
            </span>
          </div>
          <h3 className="font-semibold text-lg truncate">{lessonTitle}</h3>
          <div className="flex items-center gap-3 mt-2">
            <Progress value={progress} className="h-2 flex-1 rounded-full" />
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              {progress}%
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shrink-0 hidden sm:flex"
          render={<Link href={`/lessons/${lessonId}`} />}
        >
          <Play className="w-4 h-4 mr-1" />
          Davom etish
        </Button>
      </div>

      {/* Mobile button */}
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl mt-4 sm:hidden"
        render={<Link href={`/lessons/${lessonId}`} />}
      >
        <Play className="w-4 h-4 mr-1" />
        Davom etish
      </Button>
    </motion.div>
  );
}
