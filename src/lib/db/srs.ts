import { createClient } from "@/lib/supabase";
import type { DbVocab } from "./lessons";
import { trackDailyActivity } from "./users";

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

  trackDailyActivity(userId, 0, 0, 1);

  return !error;
}

export async function getDueFlashcards(userId: string, limit = 20) {
  const supabase = createClient();
  const now = new Date().toISOString();

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
