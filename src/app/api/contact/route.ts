import { createClient } from "@supabase/supabase-js";
import { rateLimit, getIP } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getIP(request);
    const { success: rlOk } = rateLimit(ip, {
      limit: 3,
      windowMs: 3_600_000,
    });
    if (!rlOk) {
      return Response.json(
        { error: "Juda ko'p xabar. 1 soatdan keyin urinib ko'ring." },
        { status: 429 }
      );
    }

    const { name, email, subject, message } = await request.json();

    // Validate
    if (!name || name.length < 2) {
      return Response.json(
        { error: "Ism kamida 2 ta harfdan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Email noto'g'ri formatda" },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return Response.json(
        { error: "Xabar kamida 10 ta harf bo'lishi kerak" },
        { status: 400 }
      );
    }

    // Service role client — bypasses RLS, no cookies needed
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        subject: subject || null,
        message,
      });

    if (dbError) {
      console.error("Contact save error:", dbError);
      return Response.json(
        { error: "Xabarni saqlashda xatolik yuz berdi" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Serverda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
