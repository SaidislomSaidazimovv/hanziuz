"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/user-context";
import { getProfile, getLessons, getUserProgress, getDailyActivity, type DbProfile, type DbLesson, type DbProgress } from "@/lib/db";
import StreakCard from "@/components/dashboard/StreakCard";
import XPProgressCard from "@/components/dashboard/XPProgressCard";
import ContinueLearningCard from "@/components/dashboard/ContinueLearningCard";
import QuickAccessGrid from "@/components/dashboard/QuickAccessGrid";
import WeeklyHeatmap from "@/components/dashboard/WeeklyHeatmap";
import RecommendedLesson from "@/components/dashboard/RecommendedLesson";

const defaultWeeklyData = [
  { day: "mon", label: "Du", xp: 0 },
  { day: "tue", label: "Se", xp: 0 },
  { day: "wed", label: "Ch", xp: 0 },
  { day: "thu", label: "Pa", xp: 0 },
  { day: "fri", label: "Ju", xp: 0 },
  { day: "sat", label: "Sh", xp: 0 },
  { day: "sun", label: "Ya", xp: 0 },
];

export default function DashboardClient() {
  const { id: userId, name, isLoaded } = useUser();
  const userName = name.split(" ")[0] || "";

  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [progress, setProgress] = useState<DbProgress[]>([]);
  const [weeklyData, setWeeklyData] = useState(defaultWeeklyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getProfile(userId),
      getLessons(),
      getUserProgress(userId),
      getDailyActivity(userId, 7),
    ]).then(([p, l, pr, daily]) => {
      setProfile(p);
      setLessons(l);
      setProgress(pr);

      // Build weekly heatmap from daily_activity
      const dayLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
      const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const activityMap = new Map<number, number>();
      daily.forEach((d) => {
        const dayOfWeek = new Date(d.date).getDay(); // 0=Sun
        const mapped = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0=Mon
        activityMap.set(mapped, (activityMap.get(mapped) || 0) + d.xp_earned);
      });
      setWeeklyData(
        dayKeys.map((key, i) => ({
          day: key,
          label: dayLabels[i],
          xp: activityMap.get(i) || 0,
        }))
      );

      setLoading(false);
    });
  }, [userId]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const completedLessons = progress.filter((p) => p.status === "completed");
  const inProgressLessons = progress.filter((p) => p.status === "in_progress");

  // Find next lesson to continue or recommend
  const completedIds = new Set(completedLessons.map((p) => p.lesson_id));
  const inProgressLesson = inProgressLessons[0];
  const nextLesson = lessons.find((l) => !completedIds.has(l.id));

  // Calculate today's XP (simplified — shows total XP mod daily goal)
  const todayXP = profile ? profile.total_xp % (profile.daily_goal_xp || 50) : 0;

  // Get first hanzi from lesson title_zh for preview
  const getHanziPreview = (lesson: DbLesson) =>
    lesson.title_zh?.slice(0, 2) || "学";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold">
          Xush kelibsiz{userName ? `, ${userName}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Bugun xitoy tilini o&apos;rganishni davom ettiramizmi?
        </p>
      </motion.div>

      {/* Streak + XP row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <StreakCard
          streakDays={profile?.streak_days || 0}
          bestStreak={profile?.best_streak || 0}
        />
        <XPProgressCard
          currentXP={todayXP}
          dailyGoal={profile?.daily_goal_xp || 50}
          totalXP={profile?.total_xp || 0}
        />
      </div>

      {/* Continue learning */}
      {(inProgressLesson || nextLesson) && (() => {
        const lesson = inProgressLesson
          ? lessons.find((l) => l.id === inProgressLesson.lesson_id)
          : nextLesson;
        if (!lesson) return null;
        const prog = progress.find((p) => p.lesson_id === lesson.id);
        return (
          <ContinueLearningCard
            lessonTitle={lesson.title_uz}
            lessonId={lesson.id}
            hskLevel={lesson.hsk_level}
            progress={prog?.status === "completed" ? 100 : prog ? 50 : 0}
            hanziPreview={getHanziPreview(lesson)}
          />
        );
      })()}

      {/* Quick access */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Tezkor kirish</h2>
        <QuickAccessGrid />
      </div>

      {/* Heatmap + Recommended */}
      <div className="grid lg:grid-cols-2 gap-4">
        <WeeklyHeatmap data={weeklyData} />
        {nextLesson && (
          <RecommendedLesson
            title={nextLesson.title_uz}
            lessonId={nextLesson.id}
            hskLevel={nextLesson.hsk_level}
            description={nextLesson.description_uz || ""}
            hanziPreview={getHanziPreview(nextLesson)}
            xpReward={nextLesson.xp_reward}
          />
        )}
      </div>
    </div>
  );
}
