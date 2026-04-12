import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const ok = await isValidAdminCookie(cookie);
    if (!ok) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();
    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        is_premium: false,
        premium_expires_at: null,
      })
      .eq("id", userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
