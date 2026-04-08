"use client";

import { Fragment, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Flame,
  Zap,
  BookOpen,
  Brain,
  Trophy,
  Calendar,
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import { createClient } from "@/lib/supabase";
import { getDailyActivity } from "@/lib/db";

interface Stats {
  totalXP: number;
  streakDays: number;
  bestStreak: number;
  lessonsCompleted: number;
  totalLessons: number;
  wordsLearned: number;
  totalWords: number;
  averageScore: number;
  cardsReviewed: number;
}

interface HskLevel {
  level: number;
  label: string;
  wordsLearned: number;
  totalWords: number;
  lessonsCompleted: number;
  totalLessons: number;
  color: string;
}

const dayLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

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

function getHeatColor(xp: number): string {
  if (xp === 0) return "bg-secondary";
  if (xp < 20) return "bg-primary/20";
  if (xp < 40) return "bg-primary/40";
  if (xp < 60) return "bg-primary/60";
  return "bg-primary";
}

function getActivityIcon(type: string) {
  switch (type) {
    case "lesson": return BookOpen;
    case "quiz": return Brain;
    case "flashcard": return Target;
    case "streak": return Flame;
    default: return CheckCircle2;
  }
}

export default function ProgressClient() {
  const { id: userId, isLoaded } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [hskProgress, setHskProgress] = useState<HskLevel[]>([]);
  const [recentActivity, setRecentActivity] = useState<
    { type: string; text: string; xp: number; time: string }[]
  >([]);
  const [monthlyData, setMonthlyData] = useState<
    { week: string; days: number[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    async function fetchData() {
      // Parallel fetch — all 5 queries at once
      const [
        { data: profile },
        { data: allLessons },
        { data: userProgress },
        { data: vocabData },
        { data: srsData },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("lessons").select("id, hsk_level"),
        supabase.from("user_lesson_progress").select("*").eq("user_id", userId),
        supabase.from("vocabulary").select("id, hsk_level"),
        supabase.from("srs_reviews").select("id, last_reviewed_at").eq("user_id", userId),
      ]);

      const completedProgress = (userProgress || []).filter(
        (p: { status: string }) => p.status === "completed"
      );

      const scores = completedProgress
        .map((p: { score: number | null }) => p.score)
        .filter((s: number | null): s is number => s !== null);
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
        : 0;

      // Unique vocab words learned (from completed lessons)
      const completedLessonIds = new Set(
        completedProgress.map((p: { lesson_id: string }) => p.lesson_id)
      );

      // Count words per HSK level from SRS reviews
      const reviewedVocabIds = new Set(
        (srsData || []).map((r: { id: string }) => r.id)
      );

      setStats({
        totalXP: profile?.total_xp || 0,
        streakDays: profile?.streak_days || 0,
        bestStreak: profile?.best_streak || 0,
        lessonsCompleted: completedProgress.length,
        totalLessons: (allLessons || []).length,
        wordsLearned: reviewedVocabIds.size,
        totalWords: (vocabData || []).length,
        averageScore: avgScore,
        cardsReviewed: (srsData || []).length,
      });

      // HSK level breakdown
      const lessonsByLevel: Record<number, string[]> = {};
      (allLessons || []).forEach((l: { id: string; hsk_level: number }) => {
        if (!lessonsByLevel[l.hsk_level]) lessonsByLevel[l.hsk_level] = [];
        lessonsByLevel[l.hsk_level].push(l.id);
      });

      const vocabByLevel: Record<number, number> = {};
      (vocabData || []).forEach((v: { hsk_level: number }) => {
        vocabByLevel[v.hsk_level] = (vocabByLevel[v.hsk_level] || 0) + 1;
      });

      const hskLevels: HskLevel[] = [1, 2, 3, 4, 5, 6].map((level) => {
        const levelLessons = lessonsByLevel[level] || [];
        const levelCompleted = levelLessons.filter((id) =>
          completedLessonIds.has(id)
        ).length;

        return {
          level,
          label: `HSK ${level}`,
          wordsLearned: 0, // Will be accurate when SRS tracks per-level
          totalWords: hskTotalWords[level] || 0,
          lessonsCompleted: levelCompleted,
          totalLessons: levelLessons.length,
          color: hskColors[level] || "bg-gray-500",
        };
      });
      setHskProgress(hskLevels);

      // Recent activity from completed lessons
      const recent = completedProgress
        .filter((p: { completed_at: string | null }) => p.completed_at)
        .sort((a: { completed_at: string }, b: { completed_at: string }) =>
          new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
        )
        .slice(0, 6)
        .map((p: { lesson_id: string; score: number | null; completed_at: string }) => {
          const lesson = (allLessons || []).find(
            (l: { id: string }) => l.id === p.lesson_id
          );
          const timeAgo = getTimeAgo(new Date(p.completed_at));
          return {
            type: "lesson",
            text: `Darsni yakunladi${p.score ? ` — ${p.score}%` : ""}`,
            xp: 20,
            time: timeAgo,
          };
        });

      setRecentActivity(recent);

      // Fetch daily activity for heatmap (last 28 days)
      const dailyData = await getDailyActivity(userId, 28);
      const activityMap = new Map<string, number>();
      dailyData.forEach((d) => activityMap.set(d.date, d.xp_earned));

      // Build 4-week grid
      const weeks: { week: string; days: number[] }[] = [];
      const today = new Date();
      for (let w = 3; w >= 0; w--) {
        const days: number[] = [];
        for (let d = 0; d < 7; d++) {
          const date = new Date(today);
          date.setDate(today.getDate() - (w * 7 + (6 - d)));
          const key = date.toISOString().split("T")[0];
          days.push(activityMap.get(key) || 0);
        }
        weeks.push({ week: `${4 - w}-hafta`, days });
      }
      setMonthlyData(weeks);

      setLoading(false);
    }

    fetchData();
  }, [userId]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) return null;

  const wordsPercent = stats.totalWords > 0
    ? Math.round((stats.wordsLearned / stats.totalWords) * 100)
    : 0;
  const lessonsPercent = stats.totalLessons > 0
    ? Math.round((stats.lessonsCompleted / stats.totalLessons) * 100)
    : 0;

  // Use real daily activity data from Supabase
  const monthlyActivity = monthlyData.length > 0
    ? monthlyData
    : [
        { week: "1-hafta", days: [0, 0, 0, 0, 0, 0, 0] },
        { week: "2-hafta", days: [0, 0, 0, 0, 0, 0, 0] },
        { week: "3-hafta", days: [0, 0, 0, 0, 0, 0, 0] },
        { week: "4-hafta", days: [0, 0, 0, 0, 0, 0, 0] },
      ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Natijalar</h1>
        </div>
        <p className="text-muted-foreground">
          O&apos;rganish jarayoningizni kuzatib boring
        </p>
      </motion.div>

      {/* Top stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Jami XP", value: stats.totalXP.toLocaleString(), icon: Zap, iconColor: "text-accent", bg: "bg-accent/10" },
          { label: "Kunlik seriya", value: `${stats.streakDays} kun`, icon: Flame, iconColor: "text-orange-500", bg: "bg-orange-500/10" },
          { label: "So'zlar o'rganildi", value: `${stats.wordsLearned}/${stats.totalWords}`, icon: BookOpen, iconColor: "text-primary", bg: "bg-primary/10" },
          { label: "O'rtacha ball", value: `${stats.averageScore}%`, icon: Trophy, iconColor: "text-green-500", bg: "bg-green-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="rounded-2xl border bg-card p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.iconColor)} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Lessons & Words progress */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div
          className="rounded-2xl border bg-card p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Darslar
            </h3>
            <span className="text-xs text-muted-foreground">{lessonsPercent}%</span>
          </div>
          <Progress value={lessonsPercent} className="h-2.5 rounded-full" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.lessonsCompleted} yakunlangan</span>
            <span>{stats.totalLessons} jami</span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border bg-card p-5 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Brain className="w-4 h-4 text-accent" />
              So&apos;z boyligi
            </h3>
            <span className="text-xs text-muted-foreground">{wordsPercent}%</span>
          </div>
          <Progress value={wordsPercent} className="h-2.5 rounded-full [&>div]:bg-accent" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{stats.wordsLearned} o&apos;rganilgan</span>
            <span>{stats.totalWords} jami</span>
          </div>
        </motion.div>
      </div>

      {/* Additional stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Darslar", value: stats.lessonsCompleted, icon: Brain },
          { label: "Kartochkalar", value: stats.cardsReviewed, icon: Target },
          { label: "Seriya", value: `${stats.bestStreak} kun`, icon: Clock },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="rounded-2xl border bg-card p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
          >
            <item.icon className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-xl font-bold">{item.value}</p>
            <p className="text-[10px] text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Monthly heatmap + HSK Progress */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div
          className="rounded-2xl border bg-card p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Oylik faollik
            </h3>
            <span className="text-xs text-muted-foreground">
              {stats.totalXP} XP jami
            </span>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5">
            <div />
            <div className="grid grid-cols-7 gap-1.5">
              {dayLabels.map((d) => (
                <span key={d} className="text-[9px] text-muted-foreground text-center">{d}</span>
              ))}
            </div>

            {monthlyActivity.map((week) => (
              <Fragment key={week.week}>
                <span className="text-[9px] text-muted-foreground self-center pr-1">
                  {week.week}
                </span>
                <div className="grid grid-cols-7 gap-1.5">
                  {week.days.map((xp, di) => (
                    <div
                      key={di}
                      className={cn(
                        "aspect-square rounded-md flex items-center justify-center",
                        getHeatColor(xp)
                      )}
                      title={`${xp} XP`}
                    >
                      <span className={cn(
                        "text-[8px] font-medium",
                        xp >= 40 ? "text-primary-foreground" : xp > 0 ? "text-primary" : "text-muted-foreground"
                      )}>
                        {xp > 0 ? xp : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </Fragment>
            ))}
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[9px] text-muted-foreground">Kam</span>
            {["bg-secondary", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map((cls) => (
              <div key={cls} className={cn("w-3 h-3 rounded-sm", cls)} />
            ))}
            <span className="text-[9px] text-muted-foreground">Ko&apos;p</span>
          </div>
        </motion.div>

        {/* HSK Level Progress */}
        <motion.div
          className="rounded-2xl border bg-card p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              HSK daraja bo&apos;yicha
            </h3>
          </div>

          <div className="space-y-3">
            {hskProgress.map((hsk) => {
              const pct = hsk.totalLessons > 0
                ? Math.round((hsk.lessonsCompleted / hsk.totalLessons) * 100)
                : 0;
              const isActive = hsk.totalLessons > 0;

              return (
                <div key={hsk.level} className={cn(!isActive && "opacity-40")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{hsk.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {hsk.lessonsCompleted}/{hsk.totalLessons} dars
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", hsk.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent activity */}
      <motion.div
        className="rounded-2xl border bg-card p-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          So&apos;nggi faollik
        </h3>

        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map((item, i) => {
              const Icon = getActivityIcon(item.type);
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    item.type === "streak" ? "bg-orange-500/10" : "bg-primary/10"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4",
                      item.type === "streak" ? "text-orange-500" : "text-primary"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                  {item.xp > 0 && (
                    <span className="text-xs font-semibold text-accent shrink-0">
                      +{item.xp} XP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            Hali faollik yo&apos;q. Birinchi darsni boshlang!
          </p>
        )}
      </motion.div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Hozirgina";
  if (diffMin < 60) return `${diffMin} daqiqa oldin`;
  if (diffHours < 24) return `${diffHours} soat oldin`;
  if (diffDays < 7) return `${diffDays} kun oldin`;
  return `${Math.floor(diffDays / 7)} hafta oldin`;
}
