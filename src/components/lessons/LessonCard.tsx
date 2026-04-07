"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Lesson, UserLessonProgress } from "@/lib/seed-data";

interface LessonCardProps {
  lesson: Lesson;
  progress?: UserLessonProgress;
  index: number;
}

export default function LessonCard({ lesson, progress, index }: LessonCardProps) {
  const isLocked = !lesson.isFree && (!progress || progress.status === "not_started");
  const isCompleted = progress?.status === "completed";
  const isInProgress = progress?.status === "in_progress";
  const progressValue = progress?.progress ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link
        href={isLocked ? "#" : `/lessons/${lesson.id}`}
        className={cn(
          "group block rounded-2xl border bg-card p-5 transition-all duration-300",
          isLocked
            ? "opacity-60 cursor-not-allowed"
            : "hover:shadow-lg hover:border-primary/30"
        )}
        onClick={(e) => isLocked && e.preventDefault()}
      >
        <div className="flex items-start gap-4">
          {/* Hanzi preview */}
          <div
            className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              isCompleted
                ? "bg-green-500/10 border border-green-500/20"
                : isInProgress
                  ? "bg-primary/10 border border-primary/20"
                  : isLocked
                    ? "bg-muted"
                    : "bg-secondary group-hover:bg-primary/10"
            )}
          >
            {isLocked ? (
              <Lock className="w-6 h-6 text-muted-foreground" />
            ) : (
              <span className="hanzi-display text-2xl text-foreground group-hover:text-primary transition-colors">
                {lesson.hanziPreview}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Dars {lesson.orderNum}
              </span>
              {!lesson.isFree && (
                <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] font-semibold rounded">
                  PREMIUM
                </span>
              )}
              {isCompleted && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
            </div>

            <h3 className="font-semibold text-sm truncate">{lesson.titleUz}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {lesson.titleZh} · +{lesson.xpReward} XP
            </p>

            {/* Progress bar */}
            {(isInProgress || isCompleted) && (
              <div className="flex items-center gap-2 mt-2.5">
                <Progress
                  value={progressValue}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    isCompleted && "[&>div]:bg-green-500"
                  )}
                />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {progressValue}%
                </span>
              </div>
            )}
          </div>

          {/* Play icon on hover */}
          {!isLocked && (
            <div className="hidden group-hover:flex w-9 h-9 rounded-xl bg-primary/10 items-center justify-center shrink-0 self-center">
              <Play className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
