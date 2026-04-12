import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  hashSecret,
} from "@/lib/admin-auth";
import { rateLimit, getIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getIP(request);
    const { success: rlOk } = rateLimit(ip, {
      limit: 5,
      windowMs: 300_000,
    });
    if (!rlOk) {
      return Response.json(
        { error: "Juda ko'p urinish. 5 daqiqadan keyin urinib ko'ring." },
        { status: 429 }
      );
    }

    const { password } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return Response.json(
        { error: "Server noto'g'ri sozlangan" },
        { status: 500 }
      );
    }

    if (typeof password !== "string" || password.length !== adminSecret.length) {
      return Response.json({ error: "Noto'g'ri parol" }, { status: 401 });
    }

    let diff = 0;
    for (let i = 0; i < adminSecret.length; i++) {
      diff |= password.charCodeAt(i) ^ adminSecret.charCodeAt(i);
    }
    if (diff !== 0) {
      return Response.json({ error: "Noto'g'ri parol" }, { status: 401 });
    }

    const cookieValue = await hashSecret(adminSecret);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_COOKIE_MAX_AGE,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server xatosi" }, { status: 500 });
  }
}
