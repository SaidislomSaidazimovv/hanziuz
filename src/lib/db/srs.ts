import { createClient } from "@/lib/supabase";
import type { DbVocab } from "./lessons";
import { trackDailyActivity } from "./users";

export interface SrsStats {
  due: number;
  newCount: number;
  learned: number;
  mastered: number;
  leeches: number;
  reviewedToday: number;
  tomorrowDue: number;
  weekDue: number;
}

export interface FlashcardFilter {
  limit?: number;
  hskLevel?: number;
  lessonId?: string;
  dueOnly?: boolean;
  leechesOnly?: boolean;
}

export async function saveSrsReview(
  userId: string,
  vocabId: string,
  easeFactor: number,
  intervalDays: number,
  repetitions: number,
  nextReviewAt: Date,
  lapses?: number
) {
  const supabase = createClient();
  const payload: Record<string, unknown> = {
    user_id: userId,
    vocab_id: vocabId,
    ease_factor: easeFactor,
    interval_days: intervalDays,
    repetitions,
    next_review_at: nextReviewAt.toISOString(),
    last_reviewed_at: new Date().toISOString(),
  };
  if (typeof lapses === "number") payload.lapses = lapses;

  const { error } = await supabase
    .from("srs_reviews")
    .upsert(payload, { onConflict: "user_id,vocab_id" });

  if (error) console.error("saveSrsReview error:", error);

  trackDailyActivity(userId, 0, 0, 1);

  return !error;
}

export interface SrsRecord {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  lapses: number;
}

function toSrsRecord(data: Record<string, unknown>): SrsRecord {
  return {
    ease_factor: data.ease_factor as number,
    interval_days: data.interval_days as number,
    repetitions: data.repetitions as number,
    next_review_at: data.next_review_at as string,
    lapses: typeof data.lapses === "number" ? data.lapses : 0,
  };
}

export async function getSrsRecord(
  userId: string,
  vocabId: string
): Promise<SrsRecord | null> {
  const supabase = createClient();
  // Use * so the query succeeds even before migration 017 (lapses column).
  const { data } = await supabase
    .from("srs_reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("vocab_id", vocabId)
    .maybeSingle();
  if (!data) return null;
  return toSrsRecord(data as Record<string, unknown>);
}

// Batch variant — one round-trip for many vocabIds.
export async function getSrsRecordsBatch(
  userId: string,
  vocabIds: string[]
): Promise<Map<string, SrsRecord>> {
  const map = new Map<string, SrsRecord>();
  if (vocabIds.length === 0) return map;
  const supabase = createClient();
  const { data } = await supabase
    .from("srs_reviews")
    .select("*")
    .eq("user_id", userId)
    .in("vocab_id", vocabIds);
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    map.set(row.vocab_id as string, toSrsRecord(row));
  }
  return map;
}

export async function getSrsStats(userId: string): Promise<SrsStats> {
  const supabase = createClient();

  // Try the single-RPC fast path (migration 019). If unavailable (older DB),
  // fall back to the 8-parallel-query path below.
  const { data: rpc, error: rpcError } = await supabase
    .rpc("get_srs_stats", { uid: userId })
    .maybeSingle();

  if (!rpcError && rpc) {
    const r = rpc as Record<string, number | null>;
    return {
      due: r.due ?? 0,
      newCount: r.new_count ?? 0,
      learned: r.learned ?? 0,
      mastered: r.mastered ?? 0,
      leeches: r.leeches ?? 0,
      reviewedToday: r.reviewed_today ?? 0,
      tomorrowDue: r.tomorrow_due ?? 0,
      weekDue: r.week_due ?? 0,
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart.getTime() + 86_400_000);
  const tomorrowEnd = new Date(todayStart.getTime() + 2 * 86_400_000);
  const weekEnd = new Date(todayStart.getTime() + 7 * 86_400_000);

  const [
    totalVocabRes,
    learnedRes,
    dueRes,
    masteredRes,
    leechesRes,
    todayRes,
    tomorrowRes,
    weekRes,
  ] = await Promise.all([
    supabase.from("vocabulary").select("id", { count: "exact", head: true }),
    supabase
      .from("srs_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("srs_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .lte("next_review_at", nowIso),
    supabase
      .from("srs_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("repetitions", 5),
    supabase
      .from("srs_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("lapses", 3),
    supabase
      .from("srs_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("last_reviewed_at", todayStart.toISOString()),
    supabase
      .from("srs_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("next_review_at", tomorrowStart.toISOString())
      .lt("next_review_at", tomorrowEnd.toISOString()),
    supabase
      .from("srs_reviews")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("next_review_at", nowIso)
      .lte("next_review_at", weekEnd.toISOString()),
  ]);

  const totalVocab = totalVocabRes.count ?? 0;
  const learned = learnedRes.count ?? 0;

  return {
    due: dueRes.count ?? 0,
    newCount: Math.max(0, totalVocab - learned),
    learned,
    mastered: masteredRes.count ?? 0,
    leeches: leechesRes.count ?? 0,
    reviewedToday: todayRes.count ?? 0,
    tomorrowDue: tomorrowRes.count ?? 0,
    weekDue: weekRes.count ?? 0,
  };
}

export async function getFlashcardsFiltered(
  userId: string,
  opts: FlashcardFilter = {}
): Promise<DbVocab[]> {
  const { limit = 15, hskLevel, lessonId, dueOnly, leechesOnly } = opts;
  const supabase = createClient();
  const nowIso = new Date().toISOString();

  // Step 1: build vocab pool
  let vocabPool: DbVocab[] = [];

  if (lessonId) {
    const { data } = await supabase
      .from("lesson_vocabulary")
      .select("vocabulary(*)")
      .eq("lesson_id", lessonId);
    vocabPool =
      (data
        ?.map(
          (r: { vocabulary: DbVocab | DbVocab[] | null }) =>
            Array.isArray(r.vocabulary) ? r.vocabulary[0] : r.vocabulary
        )
        .filter((v: DbVocab | null | undefined): v is DbVocab => !!v) ?? []);
  } else {
    let query = supabase.from("vocabulary").select("*").limit(500);
    if (hskLevel) query = query.eq("hsk_level", hskLevel);
    const { data } = await query.order("hsk_level");
    vocabPool = (data as DbVocab[]) ?? [];
  }

  if (vocabPool.length === 0) return [];

  const poolIds = vocabPool.map((v) => v.id);

  // Step 2: apply srs state filter
  if (leechesOnly) {
    const { data: reviews } = await supabase
      .from("srs_reviews")
      .select("vocab_id")
      .eq("user_id", userId)
      .gte("lapses", 3)
      .in("vocab_id", poolIds);
    const ids = new Set(
      (reviews ?? []).map((r: { vocab_id: string }) => r.vocab_id)
    );
    return vocabPool.filter((v) => ids.has(v.id)).slice(0, limit);
  }

  if (dueOnly) {
    const { data: reviews } = await supabase
      .from("srs_reviews")
      .select("vocab_id")
      .eq("user_id", userId)
      .lte("next_review_at", nowIso)
      .in("vocab_id", poolIds);
    const ids = new Set(
      (reviews ?? []).map((r: { vocab_id: string }) => r.vocab_id)
    );
    return vocabPool.filter((v) => ids.has(v.id)).slice(0, limit);
  }

  // Default mix: due first, then new, capped at limit
  const { data: reviews } = await supabase
    .from("srs_reviews")
    .select("vocab_id, next_review_at")
    .eq("user_id", userId)
    .in("vocab_id", poolIds);

  const reviewedMap = new Map<string, string>(
    (reviews ?? []).map((r: { vocab_id: string; next_review_at: string }) => [
      r.vocab_id,
      r.next_review_at,
    ])
  );

  const due: DbVocab[] = [];
  const fresh: DbVocab[] = [];
  for (const v of vocabPool) {
    const reviewTime = reviewedMap.get(v.id);
    if (!reviewTime) fresh.push(v);
    else if (reviewTime <= nowIso) due.push(v);
  }

  return [...due, ...fresh].slice(0, limit);
}

// Backwards-compat shim — keeps the old simple signature working.
export async function getDueFlashcards(
  userId: string,
  limit = 20
): Promise<DbVocab[]> {
  return getFlashcardsFiltered(userId, { limit });
}
