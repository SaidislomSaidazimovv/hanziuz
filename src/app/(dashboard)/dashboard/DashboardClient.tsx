"use client";

import { motion } from "framer-motion";
import { useUser } from "@/lib/user-context";
import StreakCard from "@/components/dashboard/StreakCard";
import XPProgressCard from "@/components/dashboard/XPProgressCard";
import ContinueLearningCard from "@/components/dashboard/ContinueLearningCard";
import QuickAccessGrid from "@/components/dashboard/QuickAccessGrid";
import WeeklyHeatmap from "@/components/dashboard/WeeklyHeatmap";
import RecommendedLesson from "@/components/dashboard/RecommendedLesson";

// Mock data — will be replaced with Supabase queries
const mockWeeklyData = [
  { day: "mon", label: "Du", xp: 45 },
  { day: "tue", label: "Se", xp: 60 },
  { day: "wed", label: "Ch", xp: 20 },
  { day: "thu", label: "Pa", xp: 50 },
  { day: "fri", label: "Ju", xp: 0 },
  { day: "sat", label: "Sh", xp: 35 },
  { day: "sun", label: "Ya", xp: 10 },
];

export default function DashboardClient() {
  const { name } = useUser();
  const userName = name.split(" ")[0] || "";

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
        <StreakCard streakDays={7} bestStreak={14} />
        <XPProgressCard currentXP={35} dailyGoal={50} totalXP={1250} />
      </div>

      {/* Continue learning */}
      <ContinueLearningCard
        lessonTitle="Salomlashish va tanishish"
        lessonId="lesson-1"
        hskLevel={1}
        progress={65}
        hanziPreview="你好"
      />

      {/* Quick access */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Tezkor kirish</h2>
        <QuickAccessGrid />
      </div>

      {/* Heatmap + Recommended */}
      <div className="grid lg:grid-cols-2 gap-4">
        <WeeklyHeatmap data={mockWeeklyData} />
        <RecommendedLesson
          title="Raqamlar va sanash"
          lessonId="lesson-3"
          hskLevel={1}
          description="Xitoy tilida 1 dan 100 gacha sanashni o'rganing. Kun, oy va yil aytishni mashq qiling."
          hanziPreview="一"
          xpReward={25}
        />
      </div>
    </div>
  );
}
