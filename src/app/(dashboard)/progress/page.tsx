import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProgressClient, {
  type ProgressStats,
  type HskLevelProgress,
  type RecentActivityRow,
  type MonthlyWeek,
} from "./ProgressClient";

export const metadata = {
  title: "Natijalar — HanziUz",
  description: "O'rganish natijalari va statistika",
};

const hskColors: Record<number, string> = {
  1: "bg-primary",
  2: "bg-accent",
  3: "bg-blue-500",
  4: "bg-purple-500",
  5: "bg-pink-500",
  6: "bg-orange-500",
};

const hskTotalWords: Record<number, number> = {
  1: 150, 2: 150, 3: 300, 4: 600, 5: 1300, 6: 2500,
};

export default async function ProgressPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/progress");
  const userId = user.id;

  const weekStartIso = new Date(Date.now() - 28 * 86400000)
    .toISOString()
    .split("T")[0];

  const [
    profileRes,
    lessonsRes,
    progressRes,
    vocabRes,
    srsRes,
    dailyRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("lessons").select("id, hsk_level"),
    supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", userId),
    supabase.from("vocabulary").select("id, hsk_level"),
    supabase
      .from("srs_reviews")
      .select("id, last_reviewed_at")
      .eq("user_id", userId),
    supabase
      .from("daily_activity")
      .select("date, xp_earned")
      .eq("user_id", userId)
      .gte("date", weekStartIso)
      .order("date"),
  ]);

  const profile = profileRes.data as {
    total_xp?: number;
    streak_days?: number;
    best_streak?: number;
  } | null;
  const allLessons = (lessonsRes.data ?? []) as { id: string; hsk_level: number }[];
  const userProgress = (progressRes.data ?? []) as {
    lesson_id: string;
    status: string;
    score: number | null;
    completed_at: string | null;
  }[];
  const vocabData = (vocabRes.data ?? []) as { hsk_level: number }[];
  const srsData = (srsRes.data ?? []) as { id: string; last_reviewed_at: string | null }[];
  const dailyData = (dailyRes.data ?? []) as { date: string; xp_earned: number }[];

  const completedProgress = userProgress.filter((p) => p.status === "completed");
  const scores = completedProgress
    .map((p) => p.score)
    .filter((s): s is number => s !== null);
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  const completedLessonIds = new Set(completedProgress.map((p) => p.lesson_id));
  const reviewedVocabIds = new Set(srsData.map((r) => r.id));

  const stats: ProgressStats = {
    totalXP: profile?.total_xp || 0,
    streakDays: profile?.streak_days || 0,
    bestStreak: profile?.best_streak || 0,
    lessonsCompleted: completedProgress.length,
    totalLessons: allLessons.length,
    wordsLearned: reviewedVocabIds.size,
    totalWords: vocabData.length,
    averageScore: avgScore,
    cardsReviewed: srsData.length,
  };

  const lessonsByLevel: Record<number, string[]> = {};
  allLessons.forEach((l) => {
    (lessonsByLevel[l.hsk_level] ||= []).push(l.id);
  });

  const hskProgress: HskLevelProgress[] = [1, 2, 3, 4, 5, 6].map((level) => {
    const levelLessons = lessonsByLevel[level] || [];
    const levelCompleted = levelLessons.filter((id) =>
      completedLessonIds.has(id)
    ).length;
    return {
      level,
      label: `HSK ${level}`,
      wordsLearned: 0,
      totalWords: hskTotalWords[level] || 0,
      lessonsCompleted: levelCompleted,
      totalLessons: levelLessons.length,
      color: hskColors[level] || "bg-gray-500",
    };
  });

  const recentActivity: RecentActivityRow[] = completedProgress
    .filter((p): p is typeof p & { completed_at: string } => p.completed_at !== null)
    .sort(
      (a, b) =>
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    )
    .slice(0, 6)
    .map((p) => ({
      type: "lesson",
      text: `Darsni yakunladi${p.score ? ` — ${p.score}%` : ""}`,
      xp: 20,
      completedAt: p.completed_at,
    }));

  const activityMap = new Map<string, number>();
  dailyData.forEach((d) => activityMap.set(d.date, d.xp_earned));

  const monthlyData: MonthlyWeek[] = [];
  const today = new Date();
  for (let w = 3; w >= 0; w--) {
    const days: number[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      const key = date.toISOString().split("T")[0];
      days.push(activityMap.get(key) || 0);
    }
    monthlyData.push({ week: `${4 - w}-hafta`, days });
  }

  return (
    <ProgressClient
      stats={stats}
      hskProgress={hskProgress}
      recentActivity={recentActivity}
      monthlyData={monthlyData}
    />
  );
}
