import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { DbLesson, DbProgress } from "@/lib/db";
import LessonsClient from "./LessonsClient";

export const metadata = {
  title: "Darslar — HanziUz",
  description: "HSK 1-6 darajasidagi xitoy tili darslari",
};

export default async function LessonsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/lessons");

  const [lessonsRes, progressRes] = await Promise.all([
    supabase
      .from("lessons")
      .select("*")
      .order("hsk_level")
      .order("order_num"),
    supabase
      .from("user_lesson_progress")
      .select("*")
      .eq("user_id", user.id),
  ]);

  return (
    <LessonsClient
      initialLessons={(lessonsRes.data as DbLesson[]) ?? []}
      initialProgress={(progressRes.data as DbProgress[]) ?? []}
    />
  );
}
