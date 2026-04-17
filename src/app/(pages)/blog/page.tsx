import { createPublicSupabaseClient } from "@/lib/supabase-public";
import type { DbBlogPost } from "@/lib/db";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog — HanziUz",
  description: "Xitoy tili va madaniyati haqida maqolalar",
};

// Re-fetch at most once per hour; blog posts rarely change.
// Uses cookie-less client so ISR caching actually works (cookie access
// would force Next.js to render dynamically and silently disable revalidate).
export const revalidate = 3600;

export default async function BlogPage() {
  const supabase = createPublicSupabaseClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title_uz, excerpt_uz, cover_image_url, author_name, category, read_time_minutes, published_at"
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return <BlogClient initialPosts={(data as DbBlogPost[]) ?? []} />;
}
