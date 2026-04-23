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

  // Stats: clips per HSK level (public read, fine on server)
  const { data: clipsData } = await supabase
    .from("listening_clips")
    .select("hsk_level");

  const clipsPerLevel: Record<number, number> = {};
  (clipsData ?? []).forEach((r: { hsk_level: number }) => {
    clipsPerLevel[r.hsk_level] = (clipsPerLevel[r.hsk_level] ?? 0) + 1;
  });

  return (
    <ListeningClient
      totalClips={clipsData?.length ?? 0}
      clipsPerLevel={clipsPerLevel}
    />
  );
}
