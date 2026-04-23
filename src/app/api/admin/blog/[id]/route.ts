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

async function requireAdmin() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminCookie(cookie);
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAdmin())) {
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

    // Fetch old slug first so we can invalidate both old and new paths in case
    // the slug itself changed.
    const { data: existing } = await adminClient()
      .from("blog_posts")
      .select("slug")
      .eq("id", id)
      .single();

    const { data, error } = await adminClient()
      .from("blog_posts")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/blog");
    if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
    if (data?.slug && data.slug !== existing?.slug)
      revalidatePath(`/blog/${data.slug}`);

    return Response.json({ success: true, post: data });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAdmin())) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    // Grab slug before delete so we can invalidate the article path too.
    const { data: existing } = await adminClient()
      .from("blog_posts")
      .select("slug")
      .eq("id", id)
      .single();

    const { error } = await adminClient()
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/blog");
    if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
