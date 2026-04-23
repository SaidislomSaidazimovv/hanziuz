import { createClient } from "@supabase/supabase-js";
import ListeningAdminClient, {
  type AdminListeningClip,
} from "./ListeningAdminClient";

export const dynamic = "force-dynamic";

async function loadData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [clipsRes, progressRes] = await Promise.all([
    supabase
      .from("listening_clips")
      .select(
        "id, audio_url, transcript_zh, transcript_pinyin, translation_uz, hsk_level, clip_type, created_at"
      )
      .order("hsk_level", { ascending: true })
      .order("transcript_zh", { ascending: true }),
    supabase
      .from("user_listening_progress")
      .select("clip_id, attempts, correct_count"),
  ]);

  const clips = (clipsRes.data as AdminListeningClip[]) ?? [];

  // Aggregate attempts + accuracy per clip in memory (cheap; ≤ a few hundred
  // clips × active users).
  const statsByClip = new Map<
    string,
    { attempts: number; correct: number }
  >();
  (progressRes.data ?? []).forEach(
    (r: { clip_id: string; attempts: number; correct_count: number }) => {
      const prev = statsByClip.get(r.clip_id) ?? { attempts: 0, correct: 0 };
      statsByClip.set(r.clip_id, {
        attempts: prev.attempts + r.attempts,
        correct: prev.correct + r.correct_count,
      });
    }
  );

  const enriched = clips.map((c) => {
    const s = statsByClip.get(c.id) ?? { attempts: 0, correct: 0 };
    return {
      ...c,
      total_attempts: s.attempts,
      total_correct: s.correct,
      accuracy_pct:
        s.attempts === 0 ? null : Math.round((s.correct / s.attempts) * 100),
    };
  });

  const perLevel: Record<number, number> = {};
  clips.forEach((c) => {
    perLevel[c.hsk_level] = (perLevel[c.hsk_level] ?? 0) + 1;
  });

  return {
    clips: enriched,
    totalClips: clips.length,
    perLevel,
  };
}

export default async function AdminListeningPage() {
  const { clips, totalClips, perLevel } = await loadData();
  return (
    <div className="p-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Tinglash kutubxonasi</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Jami: {totalClips.toLocaleString("uz-UZ")} ta audio
        </p>
      </header>
      <ListeningAdminClient clips={clips} perLevel={perLevel} />
    </div>
  );
}
