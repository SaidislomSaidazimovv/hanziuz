"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "./slug";

export type BlogFormData = {
  id?: string;
  title_uz: string;
  slug: string;
  category: string;
  excerpt_uz: string;
  content_uz: string;
  read_time_minutes: number;
  is_published: boolean;
};

const CATEGORIES = [
  { value: "darslik", label: "Darslik" },
  { value: "madaniyat", label: "Madaniyat" },
  { value: "maslahat", label: "Maslahat" },
  { value: "yangilik", label: "Yangilik" },
];

const EXCERPT_MAX = 200;

export default function BlogForm({
  initial,
  mode,
}: {
  initial: BlogFormData;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const slugTouchedRef = useRef(mode === "edit");

  useEffect(() => {
    if (slugTouchedRef.current) return;
    setForm((f) => ({ ...f, slug: slugify(f.title_uz) }));
  }, [form.title_uz]);

  function update<K extends keyof BlogFormData>(k: K, v: BlogFormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title_uz.trim()) return setError("Sarlavha kiritilishi shart");
    if (!form.slug.trim()) return setError("Slug kiritilishi shart");
    if (!form.content_uz.trim()) return setError("Matn kiritilishi shart");
    if (form.excerpt_uz.length > EXCERPT_MAX)
      return setError(`Qisqa matn ${EXCERPT_MAX} belgidan oshmasligi kerak`);

    setSaving(true);
    try {
      const payload = {
        title_uz: form.title_uz.trim(),
        slug: form.slug.trim(),
        category: form.category || null,
        excerpt_uz: form.excerpt_uz.trim() || null,
        content_uz: form.content_uz,
        read_time_minutes: Number(form.read_time_minutes) || 5,
        is_published: form.is_published,
      };

      const url =
        mode === "create"
          ? "/api/admin/blog"
          : `/api/admin/blog/${form.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Xatolik");
        setSaving(false);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi");
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!form.id) return;
    if (!confirm("Bu maqolani o'chirasizmi? Bu amalni qaytarib bo'lmaydi.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${form.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "O'chirishda xatolik");
        setDeleting(false);
        return;
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Tarmoq xatosi");
      setDeleting(false);
    }
  }

  const label = "block text-sm font-medium text-neutral-700 mb-1.5";
  const textarea =
    "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-5">
        <div>
          <label className={label}>Sarlavha</label>
          <Input
            value={form.title_uz}
            onChange={(e) => update("title_uz", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={label}>Slug</label>
          <Input
            value={form.slug}
            onChange={(e) => {
              slugTouchedRef.current = true;
              update("slug", e.target.value);
            }}
            className="font-mono bg-neutral-50"
            required
          />
          <p className="text-xs text-neutral-500 mt-1">
            URL uchun ishlatiladi. Sarlavhadan avtomatik yaratiladi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={label}>Kategoriya</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={textarea}
            >
              <option value="">—</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>O&apos;qish vaqti (daqiqa)</label>
            <Input
              type="number"
              min={1}
              value={form.read_time_minutes}
              onChange={(e) =>
                update("read_time_minutes", Number(e.target.value))
              }
            />
          </div>
        </div>

        <div>
          <label className={label}>Qisqa matn</label>
          <textarea
            value={form.excerpt_uz}
            onChange={(e) =>
              update("excerpt_uz", e.target.value.slice(0, EXCERPT_MAX + 50))
            }
            rows={3}
            className={textarea}
            placeholder="Maqola haqida qisqacha..."
          />
          <div
            className={`text-xs mt-1 ${
              form.excerpt_uz.length > EXCERPT_MAX
                ? "text-red-600"
                : "text-neutral-500"
            }`}
          >
            {form.excerpt_uz.length} / {EXCERPT_MAX}
          </div>
        </div>

        <div>
          <label className={label}>Matn (Markdown)</label>
          <textarea
            value={form.content_uz}
            onChange={(e) => update("content_uz", e.target.value)}
            rows={16}
            className={`${textarea} font-mono text-[13px]`}
            required
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <Toggle
              checked={form.is_published}
              onChange={(v) => update("is_published", v)}
            />
            <span className="text-sm text-neutral-700">
              {form.is_published ? "Chop etilgan" : "Qoralama"}
            </span>
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex items-center justify-between">
        <div>
          {mode === "edit" && (
            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              disabled={saving || deleting}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              {deleting ? "O'chirilmoqda..." : "O'chirish"}
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/blog")}
            disabled={saving || deleting}
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            disabled={saving || deleting}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-[#DC2626]" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
