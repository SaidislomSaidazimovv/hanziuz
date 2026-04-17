import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { DbBlogPost } from "@/lib/db";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog — HanziUz",
  description: "Xitoy tili va madaniyati haqida maqolalar",
};

// Re-fetch at most once per hour; blog posts rarely change.
export const revalidate = 3600;

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title_uz, excerpt_uz, cover_image_url, author_name, category, read_time_minutes, published_at"
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return <BlogClient initialPosts={(data as DbBlogPost[]) ?? []} />;
}
