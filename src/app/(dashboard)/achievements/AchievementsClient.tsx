"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  BookOpen,
  Brain,
  Zap,
  Crown,
  Star,
  Target,
  Sun,
  Moon,
  GraduationCap,
  Compass,
  Dumbbell,
  Plane,
  Lock,
  CheckCircle2,
  Footprints,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DbAchievement, DbUserAchievement } from "@/lib/db";

const iconMap: Record<string, React.ElementType> = {
  footprints: Footprints,
  flame: Flame,
  crown: Crown,
  "book-open": BookOpen,
  trophy: Trophy,
  "graduation-cap": GraduationCap,
  star: Star,
  sun: Sun,
  moon: Moon,
  zap: Zap,
  target: Target,
  brain: Brain,
  compass: Compass,
  dumbbell: Dumbbell,
  plane: Plane,
};

const filterTabs = [
  { key: "all", label: "Barchasi" },
  { key: "streak", label: "Seriya" },
  { key: "lesson", label: "Darslar" },
  { key: "vocab", label: "So'zlar" },
  { key: "quiz", label: "Quiz" },
  { key: "xp", label: "XP" },
  { key: "other", label: "Boshqa" },
];

function getFilterKey(conditionType: string | null): string {
  if (!conditionType) return "other";
  if (conditionType.includes("streak")) return "streak";
  if (conditionType.includes("lesson") || conditionType.includes("level_complete")) return "lesson";
  if (conditionType.includes("vocab")) return "vocab";
  if (conditionType.includes("quiz")) return "quiz";
  if (conditionType.includes("xp")) return "xp";
  return "other";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface MergedAchievement {
  achievement: DbAchievement;
  earned: DbUserAchievement | null;
}

export default function AchievementsClient({
  initialAchievements,
  initialUserAchievements,
}: {
  initialAchievements: DbAchievement[];
  initialUserAchievements: DbUserAchievement[];
}) {
  const achievements = initialAchievements;
  const userAchievements = initialUserAchievements;
  const [activeFilter, setActiveFilter] = useState("all");

  const merged = useMemo((): MergedAchievement[] => {
    const earnedMap = new Map(
      userAchievements.map((ua) => [ua.achievement_id, ua])
    );
    return achievements
      .map((a) => ({
        achievement: a,
        earned: earnedMap.get(a.id) || null,
      }))
      .sort((a, b) => {
        // Earned first, then by XP reward
        if (a.earned && !b.earned) return -1;
        if (!a.earned && b.earned) return 1;
        return a.achievement.xp_reward - b.achievement.xp_reward;
      });
  }, [achievements, userAchievements]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return merged;
    return merged.filter(
      (m) => getFilterKey(m.achievement.condition_type) === activeFilter
    );
  }, [merged, activeFilter]);

  const earnedCount = userAchievements.length;
  const totalCount = achievements.length;
  const earnedXP = merged
    .filter((m) => m.earned)
    .reduce((sum, m) => sum + m.achievement.xp_reward, 0);
  const progressPct = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Trophy className="w-6 h-6 text-accent" />
          <h1 className="text-2xl sm:text-3xl font-bold">Yutuqlar</h1>
        </div>
        <p className="text-muted-foreground">
          O&apos;rganish jarayonida erishgan yutuqlaringiz
        </p>
      </motion.div>

      {/* Summary bar */}
      <motion.div
        className="rounded-2xl border bg-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {earnedCount} / {totalCount}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  yutuq olindi
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Yutuqlardan jami +{earnedXP} XP
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-accent">{progressPct}%</span>
        </div>
        <Progress value={progressPct} className="h-2.5 rounded-full [&>div]:bg-accent" />
      </motion.div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const count =
            tab.key === "all"
              ? merged.length
              : merged.filter(
                  (m) => getFilterKey(m.achievement.condition_type) === tab.key
                ).length;
          if (count === 0 && tab.key !== "all") return null;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all",
                activeFilter === tab.key
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-card border text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {tab.label}
              <Badge
                variant="outline"
                className={cn(
                  "ml-1.5 text-[10px] px-1.5 py-0",
                  activeFilter === tab.key
                    ? "border-accent-foreground/30 text-accent-foreground"
                    : "border-border"
                )}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Achievement cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(({ achievement, earned }, i) => {
          const IconComponent = iconMap[achievement.icon || "trophy"] || Trophy;
          const isEarned = !!earned;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={cn(
                "relative rounded-2xl border p-5 transition-all",
                isEarned
                  ? "bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 hover:shadow-lg"
                  : "bg-card opacity-50"
              )}
            >
              {/* Earned checkmark */}
              {isEarned && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              )}

              {/* Icon */}
              <div className="relative mb-4">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    isEarned
                      ? "bg-accent/15"
                      : "bg-muted"
                  )}
                >
                  {isEarned ? (
                    <IconComponent
                      className={cn(
                        "w-7 h-7",
                        isEarned ? "text-accent" : "text-muted-foreground"
                      )}
                    />
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground/50" />
                  )}
                </div>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-sm mb-1">
                {achievement.title_uz}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {achievement.description_uz}
              </p>

              {/* Bottom */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-md",
                    isEarned
                      ? "bg-accent/10 text-accent"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  +{achievement.xp_reward} XP
                </span>
                {isEarned && earned.earned_at && (
                  <span className="text-[10px] text-muted-foreground">
                    Olindi: {formatDate(earned.earned_at)}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            Bu turkumda yutuqlar topilmadi
          </p>
        </div>
      )}
    </div>
  );
}
