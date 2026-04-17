"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Medal, Crown, Flame, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";
import type { LeaderboardEntry } from "@/lib/db";

type Period = "weekly" | "monthly" | "alltime";

const tabs: { key: Period; label: string }[] = [
  { key: "weekly", label: "Haftalik" },
  { key: "monthly", label: "Oylik" },
  { key: "alltime", label: "Umuman" },
];

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const podiumColors = {
  0: { bg: "bg-yellow-500/15", border: "border-yellow-500/40", text: "text-yellow-500", label: "1-o'rin" },
  1: { bg: "bg-slate-400/15", border: "border-slate-400/40", text: "text-slate-400", label: "2-o'rin" },
  2: { bg: "bg-amber-700/15", border: "border-amber-700/40", text: "text-amber-600", label: "3-o'rin" },
};

export default function LeaderboardClient({
  initialWeekly,
  initialMonthly,
  initialAllTime,
}: {
  initialWeekly: LeaderboardEntry[];
  initialMonthly: LeaderboardEntry[];
  initialAllTime: LeaderboardEntry[];
}) {
  const { id: userId } = useUser();
  const [activePeriod, setActivePeriod] = useState<Period>("alltime");

  const entries = useMemo(() => {
    if (activePeriod === "weekly") return initialWeekly;
    if (activePeriod === "monthly") return initialMonthly;
    return initialAllTime;
  }, [activePeriod, initialWeekly, initialMonthly, initialAllTime]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const userRank = useMemo(() => {
    if (!userId) return -1;
    return entries.findIndex((e) => e.id === userId);
  }, [entries, userId]);

  const userInTop = userRank >= 0 && userRank < entries.length;
  const userEntry = userInTop ? entries[userRank] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Medal className="w-6 h-6 text-accent" />
          <h1 className="text-2xl sm:text-3xl font-bold">Reyting</h1>
        </div>
        <p className="text-muted-foreground">
          Eng faol o&apos;quvchilar reytingi
        </p>
      </motion.div>

      {/* Period tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePeriod(tab.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activePeriod === tab.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20">
          <Medal className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {activePeriod === "alltime"
              ? "Hali hech kim o'rganmagan"
              : "Bu davrda faollik yo'q"}
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <motion.div
              className="flex items-end justify-center gap-3 sm:gap-4 pt-8 pb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 2nd place */}
              <PodiumCard entry={top3[1]} rank={1} isCurrentUser={top3[1].id === userId} />
              {/* 1st place */}
              <PodiumCard entry={top3[0]} rank={0} isCurrentUser={top3[0].id === userId} />
              {/* 3rd place */}
              <PodiumCard entry={top3[2]} rank={2} isCurrentUser={top3[2].id === userId} />
            </motion.div>
          )}

          {/* If less than 3 users, show them in a list instead */}
          {top3.length < 3 && top3.length > 0 && (
            <div className="space-y-2">
              {top3.map((entry, i) => (
                <RankRow
                  key={entry.id}
                  entry={entry}
                  rank={i}
                  isCurrentUser={entry.id === userId}
                />
              ))}
            </div>
          )}

          {/* Rest of the rankings */}
          {rest.length > 0 && (
            <div className="rounded-2xl border bg-card overflow-hidden">
              {rest.map((entry, i) => (
                <RankRow
                  key={entry.id}
                  entry={entry}
                  rank={i + 3}
                  isCurrentUser={entry.id === userId}
                />
              ))}
            </div>
          )}

          {/* Current user pinned at bottom if not in visible list */}
          {userEntry && userRank >= 10 && (
            <motion.div
              className="rounded-2xl border-2 border-primary/30 bg-primary/5 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="px-4 py-1.5 bg-primary/10 text-xs font-medium text-primary">
                Sizning o&apos;rningiz
              </div>
              <RankRow
                entry={userEntry}
                rank={userRank}
                isCurrentUser
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

function PodiumCard({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: 0 | 1 | 2;
  isCurrentUser: boolean;
}) {
  const colors = podiumColors[rank];
  const isFirst = rank === 0;

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border-2 p-4 transition-all",
        colors.bg,
        colors.border,
        isFirst ? "w-32 sm:w-36 -mt-8" : "w-28 sm:w-32",
        isCurrentUser && "ring-2 ring-primary"
      )}
    >
      {isFirst && (
        <Crown className="w-6 h-6 text-yellow-500 mb-1" />
      )}
      <div className="relative">
        <Avatar className={cn(isFirst ? "w-16 h-16" : "w-12 h-12")}>
          {entry.avatar_url && <AvatarImage src={entry.avatar_url} alt={entry.name || ""} />}
          <AvatarFallback className="bg-secondary text-foreground text-sm font-semibold">
            {getInitials(entry.name)}
          </AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-card",
            rank === 0 && "bg-yellow-500 text-black",
            rank === 1 && "bg-slate-400 text-black",
            rank === 2 && "bg-amber-600 text-white"
          )}
        >
          {rank + 1}
        </span>
      </div>
      <p className="text-sm font-semibold mt-2 truncate max-w-full text-center">
        {entry.name || "Foydalanuvchi"}
      </p>
      <div className="flex items-center gap-1 mt-1">
        <Zap className={cn("w-3.5 h-3.5", colors.text)} />
        <span className={cn("text-sm font-bold", colors.text)}>
          {entry.total_xp.toLocaleString()}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground mt-0.5">
        {colors.label}
      </span>
    </div>
  );
}

function RankRow({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors",
        isCurrentUser
          ? "bg-primary/5 border-l-2 border-l-primary"
          : "hover:bg-secondary/50",
        rank > 3 && "border-t border-border"
      )}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
    >
      {/* Rank */}
      <span
        className={cn(
          "w-8 text-center text-sm font-bold shrink-0",
          rank < 3 ? "text-accent" : "text-muted-foreground"
        )}
      >
        #{rank + 1}
      </span>

      {/* Avatar + Name */}
      <Avatar className="w-9 h-9 shrink-0">
        {entry.avatar_url && <AvatarImage src={entry.avatar_url} alt={entry.name || ""} />}
        <AvatarFallback className="bg-secondary text-foreground text-xs font-semibold">
          {getInitials(entry.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm truncate", isCurrentUser && "font-semibold")}>
          {entry.name || "Foydalanuvchi"}
          {isCurrentUser && (
            <span className="text-[10px] text-primary ml-1">(siz)</span>
          )}
        </p>
        <p className="text-[10px] text-muted-foreground">{entry.level}</p>
      </div>

      {/* Streak — hidden on mobile */}
      {entry.streak_days > 0 && (
        <div className="hidden sm:flex items-center gap-1 text-xs text-orange-500 shrink-0">
          <Flame className="w-3.5 h-3.5" />
          {entry.streak_days}
        </div>
      )}

      {/* XP */}
      <div className="flex items-center gap-1 shrink-0">
        <Zap className="w-3.5 h-3.5 text-accent" />
        <span className="text-sm font-bold">{entry.total_xp.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
