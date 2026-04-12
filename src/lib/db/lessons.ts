import { createClient } from "@/lib/supabase";
import {
  createNotification,
  getProfile,
  trackDailyActivity,
} from "./users";

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

export async function completeLesson(
  userId: string,
  lessonId: string,
  score: number,
  xpReward: number
) {
  const supabase = createClient();

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

  const newTotalXP = profile.total_xp + xpReward;

  createNotification(
    userId,
    "lesson_complete",
    "Dars yakunlandi!",
    `+${xpReward} XP qo'shildi. Jami: ${newTotalXP} XP`,
    "/lessons"
  );

  if (newStreak === 3) {
    createNotification(userId, "streak", "3 kunlik seriya!", "3 kun ketma-ket o'rgandingiz. Davom eting!");
  } else if (newStreak === 7) {
    createNotification(userId, "streak", "Haftalik seriya!", "7 kun ketma-ket! Ajoyib natija!");
  } else if (newStreak === 30) {
    createNotification(userId, "streak", "Oylik seriya!", "30 kun to'xtamay o'rgandingiz! Siz ustasiz!");
  }

  if (profile.total_xp < 100 && newTotalXP >= 100) {
    createNotification(userId, "xp_goal", "100 XP to'plandi!", "Birinchi 100 XP ga erishdingiz!");
  } else if (profile.total_xp < 500 && newTotalXP >= 500) {
    createNotification(userId, "xp_goal", "500 XP to'plandi!", "Ajoyib natija! Davom eting!");
  } else if (profile.total_xp < 1000 && newTotalXP >= 1000) {
    createNotification(userId, "achievement", "1000 XP ustasi!", "Siz haqiqiy o'quvchisiz!", "/progress");
  }

  const dailyGoal = profile.daily_goal_xp || 50;
  const oldTodayXP = profile.total_xp % dailyGoal;
  if (oldTodayXP + xpReward >= dailyGoal && oldTodayXP < dailyGoal) {
    createNotification(userId, "xp_goal", "Kunlik maqsadga erishdingiz!", `Bugun ${dailyGoal} XP to'pladingiz!`);
  }

  trackDailyActivity(userId, xpReward, 1, 0);

  const lessonVocab = await getLessonVocab(lessonId);
  if (lessonVocab.length > 0) {
    const now = new Date().toISOString();
    const srsEntries = lessonVocab.map((v) => ({
      user_id: userId,
      vocab_id: v.id,
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 1,
      next_review_at: new Date(Date.now() + 86400000).toISOString(),
      last_reviewed_at: now,
    }));

    await supabase
      .from("srs_reviews")
      .upsert(srsEntries, { onConflict: "user_id,vocab_id" });
  }

  return true;
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
