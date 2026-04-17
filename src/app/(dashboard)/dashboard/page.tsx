import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { currentDayIso, weekStartIsoNDaysAgo } from "@/lib/date-bounds";
import type { DbProfile, DbLesson, DbProgress } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Boshqaruv paneli — HanziUz",
  description: "Xitoy tilini o'rganish bo'yicha shaxsiy boshqaruv paneli",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  // getUser() revalidates the session with Supabase Auth — required for
  // trustworthy server-side user-id reads (per Supabase guidance).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard");

  const userId = user.id;
  const todayIso = currentDayIso();
  const weekStartIso = weekStartIsoNDaysAgo(7);

  const [profileRes, lessonsRes, progressRes, dailyRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("lessons")
      .select("*")
      .order("hsk_level")
      .order("order_num"),
    supabase.from("user_lesson_progress").select("*").eq("user_id", userId),
    supabase
      .from("daily_activity")
      .select("date, xp_earned")
      .eq("user_id", userId)
      .gte("date", weekStartIso)
      .order("date"),
  ]);

  const daily =
    (dailyRes.data as { date: string; xp_earned: number }[]) ?? [];
  const initialTodayXP =
    daily.find((d) => d.date === todayIso)?.xp_earned ?? 0;

  return (
    <DashboardClient
      initialProfile={(profileRes.data as DbProfile | null) ?? null}
      initialLessons={(lessonsRes.data as DbLesson[]) ?? []}
      initialProgress={(progressRes.data as DbProgress[]) ?? []}
      initialDaily={daily}
      initialTodayXP={initialTodayXP}
    />
  );
}
