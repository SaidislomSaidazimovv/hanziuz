import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { LeaderboardEntry } from "@/lib/db";
import LeaderboardClient from "./LeaderboardClient";

export const metadata = {
  title: "Reyting — HanziUz",
  description: "O'quvchilar reytingi",
};

const COLS = "id, name, avatar_url, total_xp, streak_days, level";
const LIMIT = 50;

async function loadPeriod(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  days: number
): Promise<LeaderboardEntry[]> {
  const startDate = new Date(Date.now() - days * 86400000)
    .toISOString()
    .split("T")[0];

  const { data: activity } = await supabase
    .from("daily_activity")
    .select("user_id, xp_earned")
    .gte("date", startDate);

  if (!activity || activity.length === 0) return [];

  const xpByUser = new Map<string, number>();
  for (const row of activity as { user_id: string; xp_earned: number }[]) {
    xpByUser.set(row.user_id, (xpByUser.get(row.user_id) || 0) + row.xp_earned);
  }

  const userIds = Array.from(xpByUser.keys());
  const { data: profiles } = await supabase
    .from("profiles")
    .select(COLS)
    .in("id", userIds);

  if (!profiles) return [];

  return (profiles as LeaderboardEntry[])
    .map((p) => ({ ...p, total_xp: xpByUser.get(p.id) || 0 }))
    .sort((a, b) => b.total_xp - a.total_xp)
    .slice(0, LIMIT);
}

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/leaderboard");

  const [weeklyRes, monthlyRes, allTimeRes] = await Promise.all([
    loadPeriod(supabase, 7),
    loadPeriod(supabase, 30),
    supabase
      .from("profiles")
      .select(COLS)
      .order("total_xp", { ascending: false })
      .limit(LIMIT),
  ]);

  return (
    <LeaderboardClient
      initialWeekly={weeklyRes}
      initialMonthly={monthlyRes}
      initialAllTime={(allTimeRes.data as LeaderboardEntry[]) ?? []}
    />
  );
}
