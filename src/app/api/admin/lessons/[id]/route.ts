import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/admin-auth";

const ALLOWED = new Set([
  "is_free",
  "xp_reward",
  "order_num",
  "title_uz",
  "title_zh",
  "description_uz",
  "hsk_level",
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!(await isValidAdminCookie(cookie))) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const update: Record<string, unknown> = {};
    for (const k of Object.keys(body)) {
      if (ALLOWED.has(k)) update[k] = body[k];
    }
    if (Object.keys(update).length === 0) {
      return Response.json({ error: "Bo'sh update" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("lessons")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ success: true, lesson: data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
