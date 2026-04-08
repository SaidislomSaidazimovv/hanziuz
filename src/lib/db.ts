import { createClient } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────
export interface DbLesson {
  id: string;
  title_uz: string;
  title_zh: string | null;
  description_uz: string | null;
  hsk_level: number;
  order_num: number;
  is_free: boolean;
  xp_reward: number;
  content: Record<string, unknown> | null;
}

export interface DbVocab {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning_uz: string;
  meaning_en: string | null;
  audio_url: string | null;
  hsk_level: number;
  example_sentence_zh: string | null;
  example_sentence_uz: string | null;
}

export interface DbProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: string;
  score: number | null;
  attempts: number;
  completed_at: string | null;
}

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

// ─── Fetch functions ─────────────────────────────────────

export async function getLessons(hskLevel?: number) {
  const supabase = createClient();
  let query = supabase
    .from("lessons")
    .select("*")
    .order("hsk_level")
    .order("order_num");

  if (hskLevel) {
    query = query.eq("hsk_level", hskLevel);
  }

  const { data, error } = await query;
  if (error) console.error("getLessons error:", error);
  return (data as DbLesson[]) || [];
}

export async function getLesson(lessonId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (error) console.error("getLesson error:", error);
  return data as DbLesson | null;
}

export async function getLessonVocab(lessonId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lesson_vocabulary")
    .select("vocab_id, order_num, vocabulary(*)")
    .eq("lesson_id", lessonId)
    .order("order_num");

  if (error) console.error("getLessonVocab error:", error);
  return (data?.map((row: Record<string, unknown>) => row.vocabulary) as DbVocab[]) || [];
}

export async function getAllVocab(hskLevel?: number) {
  const supabase = createClient();
  let query = supabase.from("vocabulary").select("*").order("hsk_level");

  if (hskLevel) {
    query = query.eq("hsk_level", hskLevel);
  }

  const { data, error } = await query;
  if (error) console.error("getAllVocab error:", error);
  return (data as DbVocab[]) || [];
}

export async function getUserProgress(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) console.error("getUserProgress error:", error);
  return (data as DbProgress[]) || [];
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

// ─── Daily Activity Tracking ─────────────────────────────

export async function trackDailyActivity(
  userId: string,
  xp: number,
  lessonsCompleted = 0,
  cardsReviewed = 0
) {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  // Try to update existing row
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

// ─── Write functions ─────────────────────────────────────

export async function completeLesson(
  userId: string,
  lessonId: string,
  score: number,
  xpReward: number
) {
  const supabase = createClient();

  // Upsert lesson progress
  const { error: progressError } = await supabase
    .from("user_lesson_progress")
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        status: "completed",
        score,
        attempts: 1,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,lesson_id" }
    );

  if (progressError) {
    console.error("completeLesson progress error:", progressError);
    return false;
  }

  // Update profile XP and streak
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

  const newBestStreak = Math.max(profile.best_streak, newStreak);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      total_xp: profile.total_xp + xpReward,
      streak_days: newStreak,
      best_streak: newBestStreak,
      last_study_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (profileError) {
    console.error("completeLesson profile error:", profileError);
    return false;
  }

  // Notifications
  const newTotalXP = profile.total_xp + xpReward;

  createNotification(
    userId,
    "lesson_complete",
    "Dars yakunlandi!",
    `+${xpReward} XP qo'shildi. Jami: ${newTotalXP} XP`,
    "/lessons"
  );

  // Streak milestone notifications
  if (newStreak === 3) {
    createNotification(userId, "streak", "3 kunlik seriya!", "3 kun ketma-ket o'rgandingiz. Davom eting!");
  } else if (newStreak === 7) {
    createNotification(userId, "streak", "Haftalik seriya!", "7 kun ketma-ket! Ajoyib natija!");
  } else if (newStreak === 30) {
    createNotification(userId, "streak", "Oylik seriya!", "30 kun to'xtamay o'rgandingiz! Siz ustasiz!");
  }

  // XP milestone notifications
  if (profile.total_xp < 100 && newTotalXP >= 100) {
    createNotification(userId, "xp_goal", "100 XP to'plandi!", "Birinchi 100 XP ga erishdingiz!");
  } else if (profile.total_xp < 500 && newTotalXP >= 500) {
    createNotification(userId, "xp_goal", "500 XP to'plandi!", "Ajoyib natija! Davom eting!");
  } else if (profile.total_xp < 1000 && newTotalXP >= 1000) {
    createNotification(userId, "achievement", "1000 XP ustasi!", "Siz haqiqiy o'quvchisiz!", "/progress");
  }

  // Daily goal notification
  const dailyGoal = profile.daily_goal_xp || 50;
  const oldTodayXP = profile.total_xp % dailyGoal;
  if (oldTodayXP + xpReward >= dailyGoal && oldTodayXP < dailyGoal) {
    createNotification(userId, "xp_goal", "Kunlik maqsadga erishdingiz!", `Bugun ${dailyGoal} XP to'pladingiz!`);
  }

  // Track daily activity
  trackDailyActivity(userId, xpReward, 1, 0);

  // Auto-learn: create SRS entries for all vocab in this lesson
  const lessonVocab = await getLessonVocab(lessonId);
  if (lessonVocab.length > 0) {
    const now = new Date().toISOString();
    const srsEntries = lessonVocab.map((v) => ({
      user_id: userId,
      vocab_id: v.id,
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 1,
      next_review_at: new Date(Date.now() + 86400000).toISOString(), // Review tomorrow
      last_reviewed_at: now,
    }));

    await supabase
      .from("srs_reviews")
      .upsert(srsEntries, { onConflict: "user_id,vocab_id" });
  }

  return true;
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

  // Track daily activity
  trackDailyActivity(userId, xp, 0, 0);

  return !error;
}

export async function saveSrsReview(
  userId: string,
  vocabId: string,
  easeFactor: number,
  intervalDays: number,
  repetitions: number,
  nextReviewAt: Date
) {
  const supabase = createClient();
  const { error } = await supabase.from("srs_reviews").upsert(
    {
      user_id: userId,
      vocab_id: vocabId,
      ease_factor: easeFactor,
      interval_days: intervalDays,
      repetitions,
      next_review_at: nextReviewAt.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,vocab_id" }
  );

  if (error) console.error("saveSrsReview error:", error);

  // Track card review in daily activity
  trackDailyActivity(userId, 0, 0, 1);

  return !error;
}

export async function getDueFlashcards(userId: string, limit = 20) {
  const supabase = createClient();
  const now = new Date().toISOString();

  // Parallel fetch — due cards, all vocab IDs, all user reviews
  const [
    { data: reviewData },
    { data: allVocab },
    { data: allReviews },
  ] = await Promise.all([
    supabase.from("srs_reviews").select("vocab_id").eq("user_id", userId).lte("next_review_at", now).limit(limit),
    supabase.from("vocabulary").select("id").order("hsk_level").limit(200),
    supabase.from("srs_reviews").select("vocab_id").eq("user_id", userId),
  ]);

  const reviewedIds = reviewData?.map((r: { vocab_id: string }) => r.vocab_id) || [];

  const reviewedSet = new Set(
    allReviews?.map((r: { vocab_id: string }) => r.vocab_id) || []
  );
  const newIds = (allVocab || [])
    .filter((v: { id: string }) => !reviewedSet.has(v.id))
    .slice(0, limit - reviewedIds.length)
    .map((v: { id: string }) => v.id);

  const allIds = [...reviewedIds, ...newIds];
  if (allIds.length === 0) return [];

  const { data: vocabData } = await supabase
    .from("vocabulary")
    .select("*")
    .in("id", allIds);

  return (vocabData as DbVocab[]) || [];
}

// ─── Notifications ───────────────────────────────────────

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

// ─── Achievements ────────────────────────────────────────

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

// ─── Leaderboard ─────────────────────────────────────────

export interface LeaderboardEntry {
  id: string;
  name: string | null;
  avatar_url: string | null;
  total_xp: number;
  streak_days: number;
  level: string;
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

  // Get aggregated XP per user for the period
  const { data: activityData, error: actError } = await supabase
    .from("daily_activity")
    .select("user_id, xp_earned")
    .gte("date", startDate);

  if (actError) {
    console.error("getLeaderboardPeriod error:", actError);
    return [];
  }

  // Aggregate XP by user
  const xpByUser = new Map<string, number>();
  (activityData || []).forEach((row: { user_id: string; xp_earned: number }) => {
    xpByUser.set(row.user_id, (xpByUser.get(row.user_id) || 0) + row.xp_earned);
  });

  if (xpByUser.size === 0) return [];

  // Fetch profiles for those users
  const userIds = Array.from(xpByUser.keys());
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, total_xp, streak_days, level")
    .in("id", userIds);

  if (!profiles) return [];

  // Merge and sort by period XP
  return (profiles as LeaderboardEntry[])
    .map((p) => ({ ...p, total_xp: xpByUser.get(p.id) || 0 }))
    .sort((a, b) => b.total_xp - a.total_xp)
    .slice(0, limit);
}

// ─── Blog ────────────────────────────────────────────────

export interface DbBlogPost {
  id: string;
  slug: string;
  title_uz: string;
  excerpt_uz: string | null;
  content_uz: string;
  cover_image_url: string | null;
  author_name: string;
  category: string | null;
  read_time_minutes: number;
  is_published: boolean;
  published_at: string;
}

export async function getBlogPosts(category?: string) {
  const supabase = createClient();
  let query = supabase
    .from("blog_posts")
    .select("id, slug, title_uz, excerpt_uz, cover_image_url, author_name, category, read_time_minutes, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) console.error("getBlogPosts error:", error);
  return (data as DbBlogPost[]) || [];
}

export async function getBlogPost(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) console.error("getBlogPost error:", error);
  return data as DbBlogPost | null;
}

export async function getRelatedPosts(category: string, excludeSlug: string, limit = 3) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title_uz, excerpt_uz, category, read_time_minutes, published_at")
    .eq("is_published", true)
    .eq("category", category)
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) console.error("getRelatedPosts error:", error);
  return (data as DbBlogPost[]) || [];
}

// ─── AI Chat ─────────────────────────────────────────────

export interface DbChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DbChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function getChatSessions(userId: string, limit = 20) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) console.error("getChatSessions error:", error);
  return (data as DbChatSession[]) || [];
}

export async function getChatMessages(sessionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at");
  if (error) console.error("getChatMessages error:", error);
  return (data as DbChatMessage[]) || [];
}

export async function createChatSession(userId: string, title = "Yangi suhbat") {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_chat_sessions")
    .insert({ user_id: userId, title })
    .select("*")
    .single();
  if (error) console.error("createChatSession error:", error);
  return data as DbChatSession | null;
}

export async function saveChatMessage(sessionId: string, role: string, content: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("ai_chat_messages")
    .insert({ session_id: sessionId, role, content });
  if (error) console.error("saveChatMessage error:", error);

  // Update session timestamp
  await supabase
    .from("ai_chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);
}

export async function updateChatSessionTitle(sessionId: string, title: string) {
  const supabase = createClient();
  await supabase
    .from("ai_chat_sessions")
    .update({ title })
    .eq("id", sessionId);
}

export async function deleteChatSession(sessionId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("ai_chat_sessions")
    .delete()
    .eq("id", sessionId);
  if (error) console.error("deleteChatSession error:", error);
}

export async function getTodayMessageCount(userId: string): Promise<number> {
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: sessions } = await supabase
    .from("ai_chat_sessions")
    .select("id")
    .eq("user_id", userId);

  if (!sessions || sessions.length === 0) return 0;

  const sessionIds = sessions.map((s: { id: string }) => s.id);
  const { count } = await supabase
    .from("ai_chat_messages")
    .select("id", { count: "exact", head: true })
    .in("session_id", sessionIds)
    .eq("role", "user")
    .gte("created_at", `${today}T00:00:00`);

  return count || 0;
}
