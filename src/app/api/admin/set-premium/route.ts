import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const ip = getIP(request);
    const { success: rlOk } = rateLimit(ip, {
      limit: 5,
      windowMs: 300_000,
    });
    if (!rlOk) {
      return Response.json(
        { error: "Juda ko'p urinish." },
        { status: 429 }
      );
    }

    const { userId, months, secret } = await request.json();

    // Accept EITHER admin cookie (dashboard) OR secret in body (legacy curl)
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const cookieOk = await isValidAdminCookie(cookie);

    const adminSecret = process.env.ADMIN_SECRET;
    const secretOk = !!adminSecret && secret === adminSecret;

    if (!cookieOk && !secretOk) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId || !months) {
      return Response.json(
        { error: "userId and months required" },
        { status: 400 }
      );
    }

    // Service role client — bypasses RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const expiresAt = new Date(
      Date.now() + months * 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        is_premium: true,
        premium_expires_at: expiresAt,
      })
      .eq("id", userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      premium_expires_at: expiresAt,
    });
  } catch {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
