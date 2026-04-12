import { createClient } from "@supabase/supabase-js";
import LessonsClient, { type AdminLesson } from "./LessonsClient";

export const dynamic = "force-dynamic";

async function loadLessons(): Promise<AdminLesson[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("lessons")
    .select("id, title_uz, title_zh, hsk_level, order_num, is_free, xp_reward")
    .order("hsk_level", { ascending: true })
    .order("order_num", { ascending: true });

  return (data as AdminLesson[]) ?? [];
}

export default async function AdminLessonsPage() {
  const lessons = await loadLessons();
  return (
    <div className="p-8 space-y-6">
      <LessonsClient initialLessons={lessons} />
    </div>
  );
}
