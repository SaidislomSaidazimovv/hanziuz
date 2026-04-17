"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

type DailyRow = { date: string; xp_earned: number };

const dayLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function buildWeekData(daily: DailyRow[]) {
  const activityMap = new Map<number, number>();
  daily.forEach((d) => {
    const dayOfWeek = new Date(d.date).getDay();
    const mapped = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    activityMap.set(mapped, (activityMap.get(mapped) || 0) + d.xp_earned);
  });
  return dayKeys.map((key, i) => ({
    day: key,
    label: dayLabels[i],
    xp: activityMap.get(i) || 0,
  }));
}

function todaysXpFromDaily(daily: DailyRow[]) {
  // Used only by the client refetch path. The initial value comes from the
  // server via a prop so hydration always matches.
  const todayIso = new Date().toISOString().split("T")[0];
  return daily.find((d) => d.date === todayIso)?.xp_earned ?? 0;
}

export default function DashboardClient({
  initialProfile,
  initialLessons,
  initialProgress,
  initialDaily,
  initialTodayXP,
}: {
  initialProfile: DbProfile | null;
  initialLessons: DbLesson[];
  initialProgress: DbProgress[];
  initialDaily: DailyRow[];
  initialTodayXP: number;
}) {
  const { id: userId, name } = useUser();
  const userName = name.split(" ")[0] || "";

  const [profile, setProfile] = useState<DbProfile | null>(initialProfile);
  const [lessons, setLessons] = useState<DbLesson[]>(initialLessons);
  const [progress, setProgress] = useState<DbProgress[]>(initialProgress);
  const [weeklyData, setWeeklyData] = useState(() => buildWeekData(initialDaily));
  const [todayXP, setTodayXP] = useState(initialTodayXP);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
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
      setTodayXP(todaysXpFromDaily(daily));
      setWeeklyData(buildWeekData(daily));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ma'lumotlarni yuklab bo'lmadi");
    }
  }, [userId]);

  // Refetch on window focus — debounced to at most once per 60s.
  // Initial data came from the server; no mount-time fetch needed.
  const lastFetchRef = useRef<number | null>(null);
  useEffect(() => {
    if (lastFetchRef.current === null) lastFetchRef.current = Date.now();
    function onFocus() {
      const now = Date.now();
      if (lastFetchRef.current !== null && now - lastFetchRef.current < 60_000)
        return;
      lastFetchRef.current = now;
      refetch();
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={refetch}>
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

  const continueLesson = inProgressLesson
    ? lessons.find((l) => l.id === inProgressLesson.lesson_id)
    : lessons.find(
        (l) => !completedIds.has(l.id) && canAccessLesson(l, profile)
      );

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
