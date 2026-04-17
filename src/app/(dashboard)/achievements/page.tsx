import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { DbAchievement, DbUserAchievement } from "@/lib/db";
import AchievementsClient from "./AchievementsClient";

export const metadata = {
  title: "Yutuqlar — HanziUz",
  description: "O'rganish yutuqlari va mukofotlar",
};

export default async function AchievementsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/achievements");

  const [allRes, earnedRes] = await Promise.all([
    supabase.from("achievements").select("*").order("xp_reward"),
    supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", user.id),
  ]);

  return (
    <AchievementsClient
      initialAchievements={(allRes.data as DbAchievement[]) ?? []}
      initialUserAchievements={(earnedRes.data as DbUserAchievement[]) ?? []}
    />
  );
}
