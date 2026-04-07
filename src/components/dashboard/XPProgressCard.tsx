"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface XPProgressCardProps {
  currentXP: number;
  dailyGoal: number;
  totalXP: number;
}

export default function XPProgressCard({
  currentXP,
  dailyGoal,
  totalXP,
}: XPProgressCardProps) {
  const percentage = Math.min((currentXP / dailyGoal) * 100, 100);

  return (
    <motion.div
      className="rounded-2xl border bg-card p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium">Kunlik maqsad</p>
            <p className="text-xs text-muted-foreground">
              Jami: {totalXP.toLocaleString()} XP
            </p>
          </div>
        </div>
        <span className="text-lg font-bold">
          {currentXP}/{dailyGoal} <span className="text-xs text-muted-foreground font-normal">XP</span>
        </span>
      </div>
      <Progress value={percentage} className="h-3 rounded-full" />
      {percentage >= 100 && (
        <p className="text-xs text-primary font-medium mt-2">
          Kunlik maqsadga erishdingiz!
        </p>
      )}
    </motion.div>
  );
}
