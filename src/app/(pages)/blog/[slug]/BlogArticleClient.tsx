"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Link2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DbBlogPost } from "@/lib/db";

function getCategoryStyle(cat: string | null): string {
  switch (cat) {
    case "darslik": return "bg-blue-500/10 text-blue-500";
    case "madaniyat": return "bg-purple-500/10 text-purple-500";
    case "maslahat": return "bg-green-500/10 text-green-500";
    case "yangilik": return "bg-red-500/10 text-red-500";
    default: return "bg-muted text-muted-foreground";
  }
}

function getCategoryLabel(cat: string | null): string {
  switch (cat) {
    case "darslik": return "Darslik";
    case "madaniyat": return "Madaniyat";
    case "maslahat": return "Maslahat";
    case "yangilik": return "Yangilik";
    default: return "Boshqa";
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Simple markdown-like renderer for content
function renderContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-primary/80">$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 before:content-[\'•\'] before:mr-2 before:text-primary">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4"><span class="text-primary font-semibold mr-1">$1.</span>$2</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-muted-foreground">')
    .replace(/^/, '<p class="mb-4 leading-relaxed text-muted-foreground">')
    .replace(/$/, '</p>');
}

export default function BlogArticleClient({
  initialPost,
  initialRelated,
}: {
  initialPost: DbBlogPost;
  initialRelated: DbBlogPost[];
}) {
  const post = initialPost;
  const related = initialRelated;
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setScrollProgress(total > 0 ? (current / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Barcha maqolalar
        </Link>

        {/* Header */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className={cn(
              "inline-block px-3 py-1 rounded-lg text-xs font-medium",
              getCategoryStyle(post.category)
            )}
          >
            {getCategoryLabel(post.category)}
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            {post.title_uz}
          </h1>

          {post.excerpt_uz && (
            <p className="text-lg text-muted-foreground">
              {post.excerpt_uz}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-4 border-b">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.read_time_minutes} daqiqa o&apos;qish
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Nusxalandi!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Havola nusxalash
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Article content */}
        <motion.div
          className="prose-custom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: renderContent(post.content_uz) }}
        />

        {/* Related articles */}
        {related.length > 0 && (
          <div className="pt-8 border-t space-y-4">
            <h3 className="font-semibold text-lg">O&apos;xshash maqolalar</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group block rounded-xl border bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <span
                    className={cn(
                      "inline-block px-2 py-0.5 rounded text-[10px] font-medium mb-2",
                      getCategoryStyle(r.category)
                    )}
                  >
                    {getCategoryLabel(r.category)}
                  </span>
                  <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {r.title_uz}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {r.read_time_minutes} daq o&apos;qish
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
