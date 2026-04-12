import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BlogForm from "../BlogForm";

export default function AdminBlogNewPage() {
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
        <h1 className="text-2xl font-semibold mt-2">Yangi maqola</h1>
      </div>

      <BlogForm
        mode="create"
        initial={{
          title_uz: "",
          slug: "",
          category: "",
          excerpt_uz: "",
          content_uz: "",
          read_time_minutes: 5,
          is_published: false,
        }}
      />
    </div>
  );
}
