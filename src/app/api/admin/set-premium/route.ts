import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { userId, months, secret } = await request.json();

    // Check admin secret
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || secret !== adminSecret) {
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
