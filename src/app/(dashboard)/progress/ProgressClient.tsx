"use client";

import { Fragment } from "react";
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- Mock data (will be replaced with Supabase queries) ---
const stats = {
  totalXP: 1250,
  level: "Boshlang'ich",
  streakDays: 7,
  bestStreak: 14,
  lessonsCompleted: 5,
  totalLessons: 11,
  wordsLearned: 22,
  totalWords: 30,
  quizzesTaken: 8,
  averageScore: 82,
  totalStudyMinutes: 340,
  cardsReviewed: 156,
};

const hskProgress = [
  { level: 1, label: "HSK 1", wordsLearned: 22, totalWords: 150, lessonsCompleted: 5, totalLessons: 8, color: "bg-primary" },
  { level: 2, label: "HSK 2", wordsLearned: 0, totalWords: 150, lessonsCompleted: 0, totalLessons: 10, color: "bg-accent" },
  { level: 3, label: "HSK 3", wordsLearned: 0, totalWords: 300, lessonsCompleted: 0, totalLessons: 15, color: "bg-blue-500" },
  { level: 4, label: "HSK 4", wordsLearned: 0, totalWords: 600, lessonsCompleted: 0, totalLessons: 20, color: "bg-purple-500" },
  { level: 5, label: "HSK 5", wordsLearned: 0, totalWords: 1300, lessonsCompleted: 0, totalLessons: 25, color: "bg-pink-500" },
  { level: 6, label: "HSK 6", wordsLearned: 0, totalWords: 2500, lessonsCompleted: 0, totalLessons: 30, color: "bg-orange-500" },
];

const monthlyActivity = [
  { week: "1-hafta", days: [30, 45, 0, 50, 20, 60, 10] },
  { week: "2-hafta", days: [40, 55, 35, 0, 45, 30, 20] },
  { week: "3-hafta", days: [50, 60, 45, 55, 0, 40, 35] },
  { week: "4-hafta", days: [35, 0, 50, 40, 60, 25, 10] },
];

const dayLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

const recentActivity = [
  { type: "lesson", text: "\"Salomlashish va tanishish\" darsini yakunladi", xp: 20, time: "2 soat oldin" },
  { type: "quiz", text: "\"Olmoshlar\" testi — 88%", xp: 15, time: "3 soat oldin" },
  { type: "flashcard", text: "15 ta kartochka takrorlandi", xp: 10, time: "5 soat oldin" },
  { type: "lesson", text: "\"Raqamlar va sanash\" darsini boshladi", xp: 0, time: "1 kun oldin" },
  { type: "streak", text: "7 kunlik seriyaga erishdi!", xp: 50, time: "1 kun oldin" },
  { type: "quiz", text: "\"Salomlashish\" testi — 95%", xp: 20, time: "2 kun oldin" },
];

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
  const wordsPercent = Math.round((stats.wordsLearned / stats.totalWords) * 100);
  const lessonsPercent = Math.round((stats.lessonsCompleted / stats.totalLessons) * 100);

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
          { label: "Testlar", value: stats.quizzesTaken, icon: Brain },
          { label: "Kartochkalar", value: stats.cardsReviewed, icon: Target },
          { label: "O'qish vaqti", value: `${Math.floor(stats.totalStudyMinutes / 60)} soat`, icon: Clock },
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

      {/* Monthly heatmap + HSK Progress side by side */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Monthly activity heatmap */}
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
              {monthlyActivity.reduce((sum, w) => sum + w.days.reduce((s, d) => s + d, 0), 0)} XP
            </span>
          </div>

          {/* Day labels */}
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

          {/* Legend */}
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
              const pct = hsk.totalWords > 0
                ? Math.round((hsk.wordsLearned / hsk.totalWords) * 100)
                : 0;
              const isActive = hsk.wordsLearned > 0;

              return (
                <div key={hsk.level} className={cn(!isActive && "opacity-50")}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{hsk.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {hsk.wordsLearned}/{hsk.totalWords} so&apos;z
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
      </motion.div>
    </div>
  );
}
