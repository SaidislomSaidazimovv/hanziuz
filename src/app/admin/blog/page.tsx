import { createClient } from "@supabase/supabase-js";
import BlogListClient, { type AdminBlogPost } from "./BlogListClient";

export const dynamic = "force-dynamic";

async function loadPosts(): Promise<AdminBlogPost[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("blog_posts")
    .select("id, title_uz, slug, category, is_published, published_at")
    .order("published_at", { ascending: false });

  return (data as AdminBlogPost[]) ?? [];
}

export default async function AdminBlogPage() {
  const posts = await loadPosts();
  return (
    <div className="p-8 space-y-6">
      <BlogListClient initialPosts={posts} />
    </div>
  );
}
