import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import BlogForm from "../../BlogForm";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Orqaga
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Maqolani tahrirlash</h1>
      </div>

      <BlogForm
        mode="edit"
        initial={{
          id: post.id,
          title_uz: post.title_uz ?? "",
          slug: post.slug ?? "",
          category: post.category ?? "",
          excerpt_uz: post.excerpt_uz ?? "",
          content_uz: post.content_uz ?? "",
          read_time_minutes: post.read_time_minutes ?? 5,
          is_published: !!post.is_published,
        }}
      />
    </div>
  );
}
