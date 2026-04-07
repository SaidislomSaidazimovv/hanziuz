"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayActivity {
  day: string;
  label: string;
  xp: number;
}

interface WeeklyHeatmapProps {
  data: DayActivity[];
}

function getIntensity(xp: number): string {
  if (xp === 0) return "bg-secondary";
  if (xp < 20) return "bg-primary/20";
  if (xp < 40) return "bg-primary/40";
  if (xp < 60) return "bg-primary/60";
  return "bg-primary";
}

export default function WeeklyHeatmap({ data }: WeeklyHeatmapProps) {
  const totalWeekXP = data.reduce((sum, d) => sum + d.xp, 0);
  const activeDays = data.filter((d) => d.xp > 0).length;

  return (
    <motion.div
      className="rounded-2xl border bg-card p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Haftalik faollik</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {totalWeekXP} XP / {activeDays} kun
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {data.map((day, i) => (
          <motion.div
            key={day.day}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
          >
            <span className="text-[10px] text-muted-foreground block mb-1.5">
              {day.label}
            </span>
            <div
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center transition-colors",
                getIntensity(day.xp)
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  day.xp > 0
                    ? day.xp >= 40
                      ? "text-primary-foreground"
                      : "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {day.xp > 0 ? day.xp : "–"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] text-muted-foreground">Kam</span>
        {["bg-secondary", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary"].map(
          (cls) => (
            <div key={cls} className={cn("w-3 h-3 rounded-sm", cls)} />
          )
        )}
        <span className="text-[10px] text-muted-foreground">Ko&apos;p</span>
      </div>
    </motion.div>
  );
}
