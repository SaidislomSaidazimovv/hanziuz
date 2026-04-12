import { createClient } from "@/lib/supabase";

export interface DbProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
  level: string;
  streak_days: number;
  best_streak: number;
  last_study_date: string | null;
  total_xp: number;
  daily_goal_xp: number;
  is_premium: boolean;
  premium_expires_at: string | null;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: string;
  title_uz: string;
  message_uz: string | null;
  href: string | null;
  is_read: boolean;
  created_at: string;
}

export interface DbAchievement {
  id: string;
  code: string;
  title_uz: string;
  description_uz: string | null;
  xp_reward: number;
  condition_type: string | null;
  condition_value: number;
  icon: string | null;
}

export interface DbUserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string | null;
  avatar_url: string | null;
  total_xp: number;
  streak_days: number;
  level: string;
}

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) console.error("getProfile error:", error);
  return data as DbProfile | null;
}

export async function trackDailyActivity(
  userId: string,
  xp: number,
  lessonsCompleted = 0,
  cardsReviewed = 0
) {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("daily_activity")
    .select("id, xp_earned, lessons_completed, cards_reviewed")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("daily_activity")
      .update({
        xp_earned: existing.xp_earned + xp,
        lessons_completed: existing.lessons_completed + lessonsCompleted,
        cards_reviewed: existing.cards_reviewed + cardsReviewed,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("daily_activity").insert({
      user_id: userId,
      date: today,
      xp_earned: xp,
      lessons_completed: lessonsCompleted,
      cards_reviewed: cardsReviewed,
    });
  }
}

export async function getDailyActivity(userId: string, days = 28) {
  const supabase = createClient();
  const startDate = new Date(Date.now() - days * 86400000)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("daily_activity")
    .select("date, xp_earned")
    .eq("user_id", userId)
    .gte("date", startDate)
    .order("date");

  if (error) console.error("getDailyActivity error:", error);
  return (data as { date: string; xp_earned: number }[]) || [];
}

export async function addXP(userId: string, xp: number) {
  const supabase = createClient();
  const profile = await getProfile(userId);
  if (!profile) return false;

  const today = new Date().toISOString().split("T")[0];
  const lastStudy = profile.last_study_date;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let newStreak = profile.streak_days;
  if (lastStudy === yesterday) {
    newStreak += 1;
  } else if (lastStudy !== today) {
    newStreak = 1;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      total_xp: profile.total_xp + xp,
      streak_days: newStreak,
      best_streak: Math.max(profile.best_streak, newStreak),
      last_study_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) console.error("addXP error:", error);

  trackDailyActivity(userId, xp, 0, 0);

  return !error;
}

export async function getNotifications(userId: string, limit = 20) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) console.error("getNotifications error:", error);
  return (data as DbNotification[]) || [];
}

export async function getUnreadCount(userId: string) {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) console.error("getUnreadCount error:", error);
  return count || 0;
}

export async function markNotificationRead(notificationId: string) {
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}

export async function createNotification(
  userId: string,
  type: string,
  titleUz: string,
  messageUz?: string,
  href?: string
) {
  const supabase = createClient();
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title_uz: titleUz,
    message_uz: messageUz || null,
    href: href || null,
  });
  if (error) console.error("createNotification error:", error);
}

export async function getAllAchievements() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("xp_reward");

  if (error) console.error("getAllAchievements error:", error);
  return (data as DbAchievement[]) || [];
}

export async function getUserAchievements(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId);

  if (error) console.error("getUserAchievements error:", error);
  return (data as DbUserAchievement[]) || [];
}

export async function getLeaderboardAllTime(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, total_xp, streak_days, level")
    .order("total_xp", { ascending: false })
    .limit(limit);

  if (error) console.error("getLeaderboardAllTime error:", error);
  return (data as LeaderboardEntry[]) || [];
}

export async function getLeaderboardPeriod(days: number, limit = 50) {
  const supabase = createClient();
  const startDate = new Date(Date.now() - days * 86400000)
    .toISOString()
    .split("T")[0];

  const { data: activityData, error: actError } = await supabase
    .from("daily_activity")
    .select("user_id, xp_earned")
    .gte("date", startDate);

  if (actError) {
    console.error("getLeaderboardPeriod error:", actError);
    return [];
  }

  const xpByUser = new Map<string, number>();
  (activityData || []).forEach((row: { user_id: string; xp_earned: number }) => {
    xpByUser.set(row.user_id, (xpByUser.get(row.user_id) || 0) + row.xp_earned);
  });

  if (xpByUser.size === 0) return [];

  const userIds = Array.from(xpByUser.keys());
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, total_xp, streak_days, level")
    .in("id", userIds);

  if (!profiles) return [];

  return (profiles as LeaderboardEntry[])
    .map((p) => ({ ...p, total_xp: xpByUser.get(p.id) || 0 }))
    .sort((a, b) => b.total_xp - a.total_xp)
    .slice(0, limit);
}
