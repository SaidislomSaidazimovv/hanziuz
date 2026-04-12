"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type AdminLesson = {
  id: string;
  title_uz: string;
  title_zh: string | null;
  hsk_level: number;
  order_num: number;
  is_free: boolean;
  xp_reward: number;
};

const HSK_LEVELS = [1, 2, 3, 4, 5, 6];

const HSK_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700",
  2: "bg-green-100 text-green-700",
  3: "bg-yellow-100 text-yellow-700",
  4: "bg-orange-100 text-orange-700",
  5: "bg-red-100 text-red-700",
  6: "bg-purple-100 text-purple-700",
};

type Filter = "all" | number;

function FreeToggle({
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
        checked ? "bg-green-600" : "bg-neutral-300"
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

export default function LessonsClient({
  initialLessons,
}: {
  initialLessons: AdminLesson[];
}) {
  const [lessons, setLessons] = useState<AdminLesson[]>(initialLessons);
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [editingXp, setEditingXp] = useState<string | null>(null);
  const [xpDraft, setXpDraft] = useState<string>("");
  const [toast, setToast] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);

  const counts = useMemo(() => {
    const c = { total: lessons.length, free: 0, premium: 0 };
    for (const l of lessons) {
      if (l.is_free) c.free++;
      else c.premium++;
    }
    return c;
  }, [lessons]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? lessons
        : lessons.filter((l) => l.hsk_level === filter),
    [lessons, filter]
  );

  function showToast(kind: "ok" | "err", text: string) {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 2500);
  }

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/lessons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Xatolik");
    return data.lesson as AdminLesson;
  }

  async function toggleFree(l: AdminLesson) {
    const next = !l.is_free;
    setBusy(l.id);
    setLessons((prev) =>
      prev.map((x) => (x.id === l.id ? { ...x, is_free: next } : x))
    );
    try {
      await patch(l.id, { is_free: next });
      showToast("ok", next ? "Bepul qilindi" : "Premium qilindi");
    } catch (e) {
      setLessons((prev) =>
        prev.map((x) => (x.id === l.id ? { ...x, is_free: l.is_free } : x))
      );
      showToast("err", e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusy(null);
    }
  }

  async function commitXp(l: AdminLesson) {
    const raw = xpDraft.trim();
    const n = Number(raw);
    setEditingXp(null);
    if (!Number.isFinite(n) || n < 0 || n === l.xp_reward) return;

    setBusy(l.id);
    const prev = l.xp_reward;
    setLessons((cur) =>
      cur.map((x) => (x.id === l.id ? { ...x, xp_reward: n } : x))
    );
    try {
      await patch(l.id, { xp_reward: n });
      showToast("ok", "XP yangilandi");
    } catch (e) {
      setLessons((cur) =>
        cur.map((x) => (x.id === l.id ? { ...x, xp_reward: prev } : x))
      );
      showToast("err", e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusy(null);
    }
  }

  async function move(l: AdminLesson, dir: -1 | 1) {
    const sameLevel = lessons
      .filter((x) => x.hsk_level === l.hsk_level)
      .sort((a, b) => a.order_num - b.order_num);
    const idx = sameLevel.findIndex((x) => x.id === l.id);
    const neighborIdx = idx + dir;
    if (neighborIdx < 0 || neighborIdx >= sameLevel.length) return;
    const neighbor = sameLevel[neighborIdx];

    setBusy(l.id);
    const origA = l.order_num;
    const origB = neighbor.order_num;
    setLessons((prev) =>
      prev.map((x) => {
        if (x.id === l.id) return { ...x, order_num: origB };
        if (x.id === neighbor.id) return { ...x, order_num: origA };
        return x;
      })
    );

    try {
      await Promise.all([
        patch(l.id, { order_num: origB }),
        patch(neighbor.id, { order_num: origA }),
      ]);
      showToast("ok", "Tartib o'zgartirildi");
    } catch (e) {
      setLessons((prev) =>
        prev.map((x) => {
          if (x.id === l.id) return { ...x, order_num: origA };
          if (x.id === neighbor.id) return { ...x, order_num: origB };
          return x;
        })
      );
      showToast("err", e instanceof Error ? e.message : "Xatolik");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Darslar</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Jami: {counts.total} • Bepul: {counts.free} • Premium:{" "}
            {counts.premium}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-neutral-200">
        <TabBtn
          active={filter === "all"}
          onClick={() => setFilter("all")}
          count={counts.total}
        >
          Barchasi
        </TabBtn>
        {HSK_LEVELS.map((lvl) => {
          const c = lessons.filter((l) => l.hsk_level === lvl).length;
          return (
            <TabBtn
              key={lvl}
              active={filter === lvl}
              onClick={() => setFilter(lvl)}
              count={c}
            >
              HSK {lvl}
            </TabBtn>
          );
        })}
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium w-32">Tartib</th>
              <th className="text-left px-4 py-3 font-medium">Sarlavha</th>
              <th className="text-left px-4 py-3 font-medium">HSK</th>
              <th className="text-left px-4 py-3 font-medium">Bepul</th>
              <th className="text-left px-4 py-3 font-medium">XP</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-neutral-500"
                >
                  Darslar topilmadi
                </td>
              </tr>
            )}
            {visible.map((l, idx) => {
              const sameLevel = lessons.filter(
                (x) => x.hsk_level === l.hsk_level
              );
              const posInLevel = sameLevel
                .slice()
                .sort((a, b) => a.order_num - b.order_num)
                .findIndex((x) => x.id === l.id);
              const isFirst = posInLevel === 0;
              const isLast = posInLevel === sameLevel.length - 1;

              const isEditing = editingXp === l.id;

              return (
                <tr
                  key={l.id}
                  className="border-t border-neutral-100 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1">
                      <span className="font-mono text-neutral-700 w-6 text-right">
                        {l.order_num}
                      </span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => move(l, -1)}
                          disabled={isFirst || busy === l.id}
                          className="p-0.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-400"
                          aria-label="Yuqoriga"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => move(l, 1)}
                          disabled={isLast || busy === l.id}
                          className="p-0.5 text-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-400"
                          aria-label="Pastga"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-neutral-900">{l.title_uz}</div>
                    {l.title_zh && (
                      <div className="text-xs text-neutral-500 mt-0.5">
                        {l.title_zh}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 font-medium ${
                        HSK_COLORS[l.hsk_level] ?? "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      HSK {l.hsk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <FreeToggle
                      checked={l.is_free}
                      onChange={() => toggleFree(l)}
                      disabled={busy === l.id}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        autoFocus
                        value={xpDraft}
                        onChange={(e) => setXpDraft(e.target.value)}
                        onBlur={() => commitXp(l)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitXp(l);
                          } else if (e.key === "Escape") {
                            setEditingXp(null);
                          }
                        }}
                        className="w-20 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-red-100"
                      />
                    ) : (
                      <button
                        onClick={() => {
                          setEditingXp(l.id);
                          setXpDraft(String(l.xp_reward));
                        }}
                        disabled={busy === l.id}
                        className="inline-flex items-center rounded px-2 py-1 font-mono text-neutral-700 hover:bg-neutral-100"
                        title="Tahrirlash uchun bosing"
                      >
                        {l.xp_reward} XP
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
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

function TabBtn({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors inline-flex items-center gap-2 ${
        active
          ? "border-[#DC2626] text-[#DC2626]"
          : "border-transparent text-neutral-600 hover:text-neutral-900"
      }`}
    >
      {children}
      <span
        className={`inline-flex items-center justify-center rounded-full text-xs px-2 min-w-[1.5rem] h-5 ${
          active ? "bg-[#DC2626] text-white" : "bg-neutral-100 text-neutral-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
