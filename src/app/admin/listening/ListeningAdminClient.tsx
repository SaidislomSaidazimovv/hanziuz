"use client";

import { useMemo, useRef, useState } from "react";
import { Play, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AdminListeningClip = {
  id: string;
  audio_url: string;
  transcript_zh: string;
  transcript_pinyin: string;
  translation_uz: string;
  hsk_level: number;
  clip_type: string;
  created_at: string;
};

type EnrichedClip = AdminListeningClip & {
  total_attempts: number;
  total_correct: number;
  accuracy_pct: number | null;
};

const LEVEL_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700",
  2: "bg-green-100 text-green-700",
  3: "bg-amber-100 text-amber-700",
  4: "bg-orange-100 text-orange-700",
  5: "bg-red-100 text-red-700",
  6: "bg-purple-100 text-purple-700",
};

export default function ListeningAdminClient({
  clips,
  perLevel,
}: {
  clips: EnrichedClip[];
  perLevel: Record<number, number>;
}) {
  const [rows, setRows] = useState(clips);
  const [activeLevel, setActiveLevel] = useState<number | "all">("all");
  const [search, setSearch] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filtered = useMemo(() => {
    let out = rows;
    if (activeLevel !== "all") out = out.filter((c) => c.hsk_level === activeLevel);
    const q = search.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (c) =>
          c.transcript_zh.includes(q) ||
          c.transcript_pinyin.toLowerCase().includes(q) ||
          c.translation_uz.toLowerCase().includes(q)
      );
    }
    return out;
  }, [rows, activeLevel, search]);

  function togglePlay(clip: EnrichedClip) {
    if (!audioRef.current) return;
    if (playingId === clip.id && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current.src = clip.audio_url;
    audioRef.current.play().catch(() => setPlayingId(null));
    setPlayingId(clip.id);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function deleteClip(clip: EnrichedClip) {
    if (
      !confirm(
        `"${clip.transcript_zh}" (${clip.transcript_pinyin}) — haqiqatan o'chirmoqchimisiz?\n\nBu audioni va barcha foydalanuvchilarning shu klipdagi natijalarini o'chiradi.`
      )
    ) {
      return;
    }
    setBusy(clip.id);
    try {
      const res = await fetch(`/api/admin/listening/${clip.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Xatolik");
        return;
      }
      setRows((prev) => prev.filter((c) => c.id !== clip.id));
      showToast("O'chirildi");
    } catch {
      showToast("Tarmoq xatosi");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        onEnded={() => setPlayingId(null)}
        onPause={() => setPlayingId((p) => (audioRef.current?.paused ? null : p))}
      />

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveLevel("all")}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${
            activeLevel === "all"
              ? "bg-[#DC2626] text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Barchasi ({rows.length})
        </button>
        {[1, 2, 3, 4, 5, 6].map((lvl) => {
          const count = perLevel[lvl] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                activeLevel === lvl
                  ? "bg-[#DC2626] text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              HSK {lvl} ({count})
            </button>
          );
        })}
      </div>

      <div>
        <Input
          placeholder="Hanzi, pinyin yoki tarjima bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium w-10"></th>
              <th className="text-left px-4 py-3 font-medium">Hanzi</th>
              <th className="text-left px-4 py-3 font-medium">Pinyin</th>
              <th className="text-left px-4 py-3 font-medium">Tarjima</th>
              <th className="text-left px-4 py-3 font-medium">HSK</th>
              <th className="text-right px-4 py-3 font-medium">Urinishlar</th>
              <th className="text-right px-4 py-3 font-medium">Aniqlik</th>
              <th className="text-right px-4 py-3 font-medium w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Audio topilmadi
                </td>
              </tr>
            )}
            {filtered.map((c) => {
              const isPlaying = playingId === c.id;
              return (
                <tr
                  key={c.id}
                  className="border-t border-neutral-100 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePlay(c)}
                      className="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center hover:bg-[#B91C1C] transition-colors"
                      aria-label={isPlaying ? "Pauza" : "Eshitish"}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-chinese text-lg text-neutral-900">
                    {c.transcript_zh}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {c.transcript_pinyin}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">
                    {c.translation_uz}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full text-xs px-2 py-0.5 font-medium ${
                        LEVEL_COLORS[c.hsk_level] ?? "bg-neutral-100"
                      }`}
                    >
                      HSK {c.hsk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-600 tabular-nums">
                    {c.total_attempts.toLocaleString("uz-UZ")}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {c.accuracy_pct === null ? (
                      <span className="text-neutral-400">—</span>
                    ) : (
                      <span
                        className={
                          c.accuracy_pct >= 70
                            ? "text-green-700"
                            : c.accuracy_pct >= 40
                              ? "text-amber-700"
                              : "text-red-700"
                        }
                      >
                        {c.accuracy_pct}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteClip(c)}
                      disabled={busy === c.id}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:border-red-300"
                      aria-label="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-sm text-white bg-neutral-900">
          {toast}
        </div>
      )}
    </>
  );
}
