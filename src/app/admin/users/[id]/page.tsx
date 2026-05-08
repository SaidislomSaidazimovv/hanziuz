import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";
import UserDetailClient, { type UserDetail } from "./UserDetailClient";

export const dynamic = "force-dynamic";

const COLS_PROFILE = "id, name, avatar_url, level, total_xp, daily_goal_xp, streak_days, best_streak, last_study_date, is_premium, premium_expires_at, created_at, updated_at";

async function loadDetail(userId: string): Promise<UserDetail | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    profileRes,
    authUserRes,
    progressRes,
    lessonsRes,
    achievementsRes,
    userAchievementsRes,
    dailyRes,
    listeningRes,
    listeningClipsRes,
    srsRes,
    chatSessionsRes,
  ] = await Promise.all([
    supabase.from("profiles").select(COLS_PROFILE).eq("id", userId).maybeSingle(),
    supabase.auth.admin.getUserById(userId),
    supabase
      .from("user_lesson_progress")
      .select("lesson_id, status, score, attempts, completed_at")
      .eq("user_id", userId),
    supabase
      .from("lessons")
      .select("id, title_uz, hsk_level, order_num, xp_reward")
      .order("hsk_level")
      .order("order_num"),
    supabase.from("achievements").select("id, code, title_uz, xp_reward, icon"),
    supabase
      .from("user_achievements")
      .select("achievement_id, earned_at")
      .eq("user_id", userId),
    supabase
      .from("daily_activity")
      .select("date, xp_earned, lessons_completed, cards_reviewed")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(60),
    supabase
      .from("user_listening_progress")
      .select("clip_id, mode, attempts, correct_count, last_attempted_at")
      .eq("user_id", userId),
    supabase
      .from("listening_clips")
      .select("id, transcript_zh, transcript_pinyin, hsk_level"),
    supabase
      .from("srs_reviews")
      .select("vocab_id, ease_factor, interval_days, repetitions, lapses, next_review_at")
      .eq("user_id", userId),
    supabase
      .from("ai_chat_sessions")
      .select("id, created_at")
      .eq("user_id", userId),
  ]);

  if (!profileRes.data) return null;

  const profile = profileRes.data;
  const authUser = authUserRes.data?.user ?? null;

  const progress = progressRes.data ?? [];
  const lessons = lessonsRes.data ?? [];
  const lessonsById = new Map(lessons.map((l) => [l.id, l]));

  const achievements = achievementsRes.data ?? [];
  const userAchievements = userAchievementsRes.data ?? [];
  const earnedAchievementIds = new Set(
    userAchievements.map((ua: { achievement_id: string }) => ua.achievement_id)
  );

  const lessonProgress = lessons.map((l) => {
    const p = progress.find((x: { lesson_id: string }) => x.lesson_id === l.id);
    return {
      lesson_id: l.id,
      title_uz: l.title_uz,
      hsk_level: l.hsk_level,
      order_num: l.order_num,
      status: p?.status ?? null,
      score: p?.score ?? null,
      completed_at: p?.completed_at ?? null,
    };
  });

  const lessonsCompleted = progress.filter(
    (p: { status: string }) => p.status === "completed"
  ).length;

  const daily = dailyRes.data ?? [];

  const listeningRows = listeningRes.data ?? [];
  const listeningClips = listeningClipsRes.data ?? [];
  const clipById = new Map(listeningClips.map((c) => [c.id, c]));

  const totalListeningAttempts = listeningRows.reduce(
    (s: number, r: { attempts: number }) => s + r.attempts,
    0
  );
  const totalListeningCorrect = listeningRows.reduce(
    (s: number, r: { correct_count: number }) => s + r.correct_count,
    0
  );
  const listeningAccuracy =
    totalListeningAttempts === 0
      ? 0
      : Math.round((totalListeningCorrect / totalListeningAttempts) * 100);

  const struggleClips = listeningRows
    .filter(
      (r: { attempts: number; correct_count: number }) =>
        r.attempts >= 2 && r.correct_count / r.attempts < 0.5
    )
    .map((r: { clip_id: string; attempts: number; correct_count: number }) => {
      const clip = clipById.get(r.clip_id);
      return {
        clip_id: r.clip_id,
        transcript_zh: clip?.transcript_zh ?? "?",
        transcript_pinyin: clip?.transcript_pinyin ?? "?",
        hsk_level: clip?.hsk_level ?? 0,
        attempts: r.attempts,
        correct: r.correct_count,
        accuracy_pct: Math.round((r.correct_count / r.attempts) * 100),
      };
    })
    .sort((a, b) => a.accuracy_pct - b.accuracy_pct)
    .slice(0, 10);

  const srs = srsRes.data ?? [];
  const dueNow = srs.filter(
    (r: { next_review_at: string }) =>
      new Date(r.next_review_at) <= new Date()
  ).length;
  const mastered = srs.filter(
    (r: { repetitions: number }) => r.repetitions >= 5
  ).length;
  const leeches = srs.filter(
    (r: { lapses: number | null }) => (r.lapses ?? 0) >= 3
  ).length;

  return {
    profile: {
      id: profile.id,
      name: profile.name,
      avatar_url: profile.avatar_url,
      level: profile.level,
      total_xp: profile.total_xp,
      daily_goal_xp: profile.daily_goal_xp,
      streak_days: profile.streak_days,
      best_streak: profile.best_streak,
      last_study_date: profile.last_study_date,
      is_premium: profile.is_premium,
      premium_expires_at: profile.premium_expires_at,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    },
    auth: {
      email: authUser?.email ?? null,
      last_sign_in_at: authUser?.last_sign_in_at ?? null,
      created_at: authUser?.created_at ?? null,
    },
    counts: {
      total_lessons: lessons.length,
      lessons_completed: lessonsCompleted,
      total_achievements: achievements.length,
      earned_achievements: earnedAchievementIds.size,
      srs_total: srs.length,
      srs_due_now: dueNow,
      srs_mastered: mastered,
      srs_leeches: leeches,
      listening_attempts: totalListeningAttempts,
      listening_correct: totalListeningCorrect,
      listening_accuracy_pct: listeningAccuracy,
      ai_sessions: chatSessionsRes.data?.length ?? 0,
    },
    daily,
    lesson_progress: lessonProgress,
    earned_achievements: achievements.filter((a) =>
      earnedAchievementIds.has(a.id)
    ),
    struggle_clips: struggleClips,
  };
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadDetail(id);
  if (!data) notFound();

  return (
    <div className="p-8 space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Foydalanuvchilar
        </Link>
      </div>
      <UserDetailClient detail={data} />
    </div>
  );
}
