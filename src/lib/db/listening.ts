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
