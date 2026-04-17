import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Sozlamalar — HanziUz",
  description: "Profil sozlamalari",
};

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/settings");

  return <SettingsClient />;
}
