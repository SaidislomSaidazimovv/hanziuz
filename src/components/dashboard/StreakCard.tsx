"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakCardProps {
  streakDays: number;
  bestStreak: number;
}

export default function StreakCard({
  streakDays,
  bestStreak,
}: StreakCardProps) {
  return (
    <motion.div
      className="rounded-2xl border bg-card p-5 flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center shrink-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Flame className="w-7 h-7 text-orange-500" />
        </motion.div>
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold">{streakDays}</span>
          <span className="text-sm text-muted-foreground">kunlik seriya</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Eng yaxshi: {bestStreak} kun
        </p>
      </div>
    </motion.div>
  );
}
