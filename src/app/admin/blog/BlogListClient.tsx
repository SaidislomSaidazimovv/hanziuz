"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "./BlogForm";

export type AdminBlogPost = {
  id: string;
  title_uz: string;
  slug: string;
  category: string | null;
  is_published: boolean;
  published_at: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  darslik: "bg-blue-100 text-blue-700",
  madaniyat: "bg-purple-100 text-purple-700",
  maslahat: "bg-green-100 text-green-700",
  yangilik: "bg-red-100 text-red-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  darslik: "Darslik",
  madaniyat: "Madaniyat",
  maslahat: "Maslahat",
  yangilik: "Yangilik",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogListClient({
  initialPosts,
}: {
  initialPosts: AdminBlogPost[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  function showToast(kind: "ok" | "err", text: string) {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3000);
  }

  async function togglePublished(p: AdminBlogPost) {
    setBusy(p.id);
    const next = !p.is_published;
    setPosts((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, is_published: next } : x))
    );
    try {
      const res = await fetch(`/api/admin/blog/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: next }),
      });
      if (!res.ok) {
        // Revert
        setPosts((prev) =>
          prev.map((x) =>
            x.id === p.id ? { ...x, is_published: p.is_published } : x
          )
        );
        const data = await res.json();
        showToast("err", data.error || "Xatolik");
      } else {
        showToast("ok", next ? "Chop etildi" : "Qoralamaga o'tkazildi");
      }
    } catch {
      setPosts((prev) =>
        prev.map((x) =>
          x.id === p.id ? { ...x, is_published: p.is_published } : x
        )
      );
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(null);
    }
  }

  async function remove(p: AdminBlogPost) {
    if (!confirm(`"${p.title_uz}" maqolasini o'chirasizmi?`)) return;
    setBusy(p.id);
    try {
      const res = await fetch(`/api/admin/blog/${p.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        showToast("err", data.error || "Xatolik");
        return;
      }
      setPosts((prev) => prev.filter((x) => x.id !== p.id));
      showToast("ok", "Maqola o'chirildi");
    } catch {
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Blog</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Jami: {posts.length} ta maqola
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            <Plus className="h-4 w-4 mr-1" />
            Yangi maqola
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Sarlavha</th>
              <th className="text-left px-4 py-3 font-medium">Kategoriya</th>
              <th className="text-left px-4 py-3 font-medium">Chop etilgan</th>
              <th className="text-left px-4 py-3 font-medium">Sana</th>
              <th className="text-right px-4 py-3 font-medium">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  Maqolalar topilmadi
                </td>
              </tr>
            )}
            {posts.map((p) => (
              <tr
                key={p.id}
                className="border-t border-neutral-100 hover:bg-neutral-50"
              >
                <td className="px-4 py-3">
                  <div className="text-neutral-900">{p.title_uz}</div>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">
                    /{p.slug}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.category ? (
                    <span
                      className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 font-medium ${
                        CATEGORY_COLORS[p.category] ??
                        "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Toggle
                    checked={p.is_published}
                    onChange={() => togglePublished(p)}
                    disabled={busy === p.id}
                  />
                </td>
                <td className="px-4 py-3 text-neutral-600 whitespace-nowrap">
                  {formatDate(p.published_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link href={`/admin/blog/${p.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => remove(p)}
                      disabled={busy === p.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-sm text-white ${
            toast.kind === "ok" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}
