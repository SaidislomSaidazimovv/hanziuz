import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/admin-auth";

const ALLOWED = new Set([
  "slug",
  "title_uz",
  "excerpt_uz",
  "content_uz",
  "cover_image_url",
  "author_name",
  "category",
  "read_time_minutes",
  "is_published",
  "published_at",
]);

function pick(input: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(input)) {
    if (ALLOWED.has(k)) out[k] = input[k];
  }
  return out;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!(await isValidAdminCookie(cookie))) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const payload = pick(body);

    if (!payload.title_uz || !payload.slug || !payload.content_uz) {
      return Response.json(
        { error: "title_uz, slug, content_uz majburiy" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Drop the ISR cache so the new post is visible immediately.
    revalidatePath("/blog");
    if (data?.slug) revalidatePath(`/blog/${data.slug}`);

    return Response.json({ success: true, post: data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
