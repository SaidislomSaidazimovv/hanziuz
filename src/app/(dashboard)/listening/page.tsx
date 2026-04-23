import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ListeningClient from "./ListeningClient";

export const metadata = {
  title: "Tinglash — HanziUz",
  description: "Xitoycha audio bilan quloq mashq qiling",
};

export default async function ListeningPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/listening");

  // Clip inventory (public read, fine on server)
  const [{ data: clipsData }, { data: progressRows }] = await Promise.all([
    supabase.from("listening_clips").select("hsk_level"),
    supabase
      .from("user_listening_progress")
      .select("clip_id, attempts, correct_count")
      .eq("user_id", user.id),
  ]);

  const clipsPerLevel: Record<number, number> = {};
  (clipsData ?? []).forEach((r: { hsk_level: number }) => {
    clipsPerLevel[r.hsk_level] = (clipsPerLevel[r.hsk_level] ?? 0) + 1;
  });

  const rows = (progressRows ?? []) as {
    clip_id: string;
    attempts: number;
    correct_count: number;
  }[];
  const uniqueClips = new Set(rows.map((r) => r.clip_id)).size;
  const totalAttempts = rows.reduce((s, r) => s + r.attempts, 0);
  const totalCorrect = rows.reduce((s, r) => s + r.correct_count, 0);
  const accuracyPct =
    totalAttempts === 0 ? 0 : Math.round((totalCorrect / totalAttempts) * 100);

  return (
    <ListeningClient
      totalClips={clipsData?.length ?? 0}
      clipsPerLevel={clipsPerLevel}
      userProgress={{
        attemptedClips: uniqueClips,
        totalAttempts,
        totalCorrect,
        accuracyPct,
      }}
    />
  );
}
