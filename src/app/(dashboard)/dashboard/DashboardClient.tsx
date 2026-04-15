"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useUser } from "@/lib/user-context";
import { canAccessLesson } from "@/lib/premium";
import {
  getProfile,
  getLessons,
  getUserProgress,
  getDailyActivity,
  type DbProfile,
  type DbLesson,
  type DbProgress,
} from "@/lib/db";
import { Button } from "@/components/ui/button";
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

const dayLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function DashboardClient() {
  const { id: userId, name, isLoaded } = useUser();
  const userName = name.split(" ")[0] || "";

  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [progress, setProgress] = useState<DbProgress[]>([]);
  const [weeklyData, setWeeklyData] = useState(defaultWeeklyData);
  const [todayXP, setTodayXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setError(null);
    try {
      const [p, l, pr, daily] = await Promise.all([
        getProfile(userId),
        getLessons(),
        getUserProgress(userId),
        getDailyActivity(userId, 7),
      ]);
      setProfile(p);
      setLessons(l);
      setProgress(pr);

      const todayIso = new Date().toISOString().split("T")[0];
      const todayRow = daily.find((d) => d.date === todayIso);
      setTodayXP(todayRow?.xp_earned ?? 0);

      const activityMap = new Map<number, number>();
      daily.forEach((d) => {
        const dayOfWeek = new Date(d.date).getDay();
        const mapped = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        activityMap.set(mapped, (activityMap.get(mapped) || 0) + d.xp_earned);
      });
      setWeeklyData(
        dayKeys.map((key, i) => ({
          day: key,
          label: dayLabels[i],
          xp: activityMap.get(i) || 0,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Refresh on window focus — catches XP/progress changes after completing a lesson
  useEffect(() => {
    function onFocus() {
      fetchAll();
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchAll]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={fetchAll}>
          Qayta urinib ko&apos;rish
        </Button>
      </div>
    );
  }

  const completedLessons = progress.filter((p) => p.status === "completed");
  const inProgressLessons = progress
    .filter((p) => p.status === "in_progress")
    .sort((a, b) =>
      (b.completed_at ?? "").localeCompare(a.completed_at ?? "")
    );

  const completedIds = new Set(completedLessons.map((p) => p.lesson_id));
  const inProgressLesson = inProgressLessons[0];

  // Pick the continue target: in-progress lesson if any, else first accessible uncompleted
  const continueLesson = inProgressLesson
    ? lessons.find((l) => l.id === inProgressLesson.lesson_id)
    : lessons.find(
        (l) => !completedIds.has(l.id) && canAccessLesson(l, profile)
      );

  // Pick a DIFFERENT lesson for the recommendation card
  const recommendedLesson = lessons.find(
    (l) =>
      !completedIds.has(l.id) &&
      l.id !== continueLesson?.id &&
      canAccessLesson(l, profile)
  );

  const getHanziPreview = (lesson: DbLesson) =>
    lesson.title_zh?.slice(0, 2) || "学";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      {continueLesson && (
        <ContinueLearningCard
          lessonTitle={continueLesson.title_uz}
          lessonId={continueLesson.id}
          hskLevel={continueLesson.hsk_level}
          progress={
            progress.find((p) => p.lesson_id === continueLesson.id)?.status ===
            "completed"
              ? 100
              : inProgressLesson
                ? 50
                : 0
          }
          hanziPreview={getHanziPreview(continueLesson)}
        />
      )}

      <div>
        <h2 className="font-semibold text-lg mb-3">Tezkor kirish</h2>
        <QuickAccessGrid />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <WeeklyHeatmap data={weeklyData} />
        {recommendedLesson && (
          <RecommendedLesson
            title={recommendedLesson.title_uz}
            lessonId={recommendedLesson.id}
            hskLevel={recommendedLesson.hsk_level}
            description={recommendedLesson.description_uz || ""}
            hanziPreview={getHanziPreview(recommendedLesson)}
            xpReward={recommendedLesson.xp_reward}
          />
        )}
      </div>
    </div>
  );
}
