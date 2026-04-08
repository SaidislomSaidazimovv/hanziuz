import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
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

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
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
