import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase-public";
import type { DbBlogPost } from "@/lib/db";
import BlogArticleClient from "./BlogArticleClient";

export const metadata = {
  title: "Maqola — HanziUz Blog",
};

// Blog articles rarely change; revalidate hourly so admin edits land promptly.
// Uses cookie-less client so revalidate actually caches.
export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createPublicSupabaseClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((row: { slug: string }) => ({ slug: row.slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  let related: DbBlogPost[] = [];
  if (post.category) {
    const { data } = await supabase
      .from("blog_posts")
      .select(
        "id, slug, title_uz, excerpt_uz, category, read_time_minutes, published_at"
      )
      .eq("is_published", true)
      .eq("category", post.category)
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(3);
    related = (data as DbBlogPost[]) ?? [];
  }

  return (
    <BlogArticleClient
      initialPost={post as DbBlogPost}
      initialRelated={related}
    />
  );
}
