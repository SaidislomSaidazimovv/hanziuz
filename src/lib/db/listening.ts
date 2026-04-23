import { createClient } from "@/lib/supabase";

export interface ListeningClip {
  id: string;
  audio_url: string;
  transcript_zh: string;
  transcript_pinyin: string;
  translation_uz: string;
  duration_seconds: number | null;
  hsk_level: number;
  clip_type: string;
}

export interface ListeningStats {
  totalClips: number;
  clipsPerLevel: Record<number, number>;
}

export type ListeningMode = "word" | "tone";

export async function getListeningStats(): Promise<ListeningStats> {
  const supabase = createClient();
  const { data } = await supabase
    .from("listening_clips")
    .select("hsk_level");

  const clipsPerLevel: Record<number, number> = {};
  (data ?? []).forEach((r: { hsk_level: number }) => {
    clipsPerLevel[r.hsk_level] = (clipsPerLevel[r.hsk_level] ?? 0) + 1;
  });
  const totalClips = (data ?? []).length;

  return { totalClips, clipsPerLevel };
}

export async function getListeningClipsForSession(
  hskLevel: number,
  limit = 50
): Promise<ListeningClip[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("listening_clips")
    .select(
      "id, audio_url, transcript_zh, transcript_pinyin, translation_uz, duration_seconds, hsk_level, clip_type"
    )
    .eq("hsk_level", hskLevel)
    .eq("clip_type", "word")
    .limit(limit);
  return (data as ListeningClip[]) ?? [];
}

/**
 * Fetches clips matching a list of hanzi strings — used by the in-lesson
 * listening step to pull audio for that lesson's specific vocabulary.
 */
export async function getListeningClipsByHanzi(
  hanziList: string[]
): Promise<ListeningClip[]> {
  if (hanziList.length === 0) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("listening_clips")
    .select(
      "id, audio_url, transcript_zh, transcript_pinyin, translation_uz, duration_seconds, hsk_level, clip_type"
    )
    .in("transcript_zh", hanziList)
    .eq("clip_type", "word");
  return (data as ListeningClip[]) ?? [];
}

/**
 * Records one attempt of a user on a clip. Upserts — first attempt creates
 * the row, subsequent attempts increment counters.
 */
export async function recordListeningAttempt(
  userId: string,
  clipId: string,
  mode: ListeningMode,
  correct: boolean
): Promise<void> {
  const supabase = createClient();

  // Try to fetch existing row first
  const { data: existing } = await supabase
    .from("user_listening_progress")
    .select("id, attempts, correct_count")
    .eq("user_id", userId)
    .eq("clip_id", clipId)
    .eq("mode", mode)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("user_listening_progress")
      .update({
        attempts: existing.attempts + 1,
        correct_count: existing.correct_count + (correct ? 1 : 0),
        last_attempted_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("user_listening_progress").insert({
      user_id: userId,
      clip_id: clipId,
      mode,
      attempts: 1,
      correct_count: correct ? 1 : 0,
    });
  }
}

/**
 * Aggregate listening progress across modes: total clips heard, total correct,
 * overall accuracy.
 */
export async function getListeningProgressSummary(userId: string): Promise<{
  attemptedClips: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracyPct: number;
}> {
  const supabase = createClient();
  const { data } = await supabase
    .from("user_listening_progress")
    .select("clip_id, attempts, correct_count")
    .eq("user_id", userId);

  const rows = data ?? [];
  const uniqueClips = new Set(rows.map((r) => r.clip_id));
  const totalAttempts = rows.reduce((s, r) => s + r.attempts, 0);
  const totalCorrect = rows.reduce((s, r) => s + r.correct_count, 0);
  const accuracyPct =
    totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);

  return {
    attemptedClips: uniqueClips.size,
    totalAttempts,
    totalCorrect,
    accuracyPct,
  };
}

/**
 * Extracts the Mandarin tone number (1-4) from a pinyin string by looking
 * for the tone mark. Returns 5 for neutral (no mark).
 */
export function extractTone(pinyin: string): 1 | 2 | 3 | 4 | 5 {
  const TONE: Record<string, 1 | 2 | 3 | 4> = {
    ā: 1, ē: 1, ī: 1, ō: 1, ū: 1, "ǖ": 1,
    á: 2, é: 2, í: 2, ó: 2, ú: 2, "ǘ": 2,
    ǎ: 3, ě: 3, ǐ: 3, ǒ: 3, ǔ: 3, "ǚ": 3,
    à: 4, è: 4, ì: 4, ò: 4, ù: 4, "ǜ": 4,
  };
  for (const ch of pinyin) {
    const t = TONE[ch];
    if (t) return t;
  }
  return 5;
}
