"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileText, Calendar, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlogPosts, type DbBlogPost } from "@/lib/db";

const categories = [
  { key: "all", label: "Barchasi" },
  { key: "darslik", label: "Darslik", color: "bg-blue-500/10 text-blue-500" },
  { key: "madaniyat", label: "Madaniyat", color: "bg-purple-500/10 text-purple-500" },
  { key: "maslahat", label: "Maslahat", color: "bg-green-500/10 text-green-500" },
  { key: "yangilik", label: "Yangilik", color: "bg-red-500/10 text-red-500" },
];

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
  return categories.find((c) => c.key === cat)?.label || cat || "Boshqa";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Gradient placeholders for articles without cover images
const gradients = [
  "from-primary/20 to-accent/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-amber-500/20 to-red-500/20",
];

export default function BlogClient() {
  const [posts, setPosts] = useState<DbBlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">Blog</h1>
        <p className="text-muted-foreground text-lg">
          Xitoy tili va madaniyati haqida foydali maqolalar
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Bu turkumda maqolalar topilmadi
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                {/* Cover image or gradient */}
                <div
                  className={cn(
                    "h-40 flex items-center justify-center relative",
                    post.cover_image_url
                      ? ""
                      : `bg-gradient-to-br ${gradients[i % gradients.length]}`
                  )}
                >
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title_uz}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="font-chinese text-5xl opacity-20">
                      {["学", "文", "语", "书", "读"][i % 5]}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  {/* Category badge */}
                  <span
                    className={cn(
                      "inline-block px-2.5 py-1 rounded-lg text-xs font-medium",
                      getCategoryStyle(post.category)
                    )}
                  >
                    {getCategoryLabel(post.category)}
                  </span>

                  {/* Title */}
                  <h2 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title_uz}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt_uz && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt_uz}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time_minutes} daq
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
