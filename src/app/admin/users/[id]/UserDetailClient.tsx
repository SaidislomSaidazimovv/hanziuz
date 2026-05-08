"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Crown,
  Flame,
  Trophy,
  BookOpen,
  Headphones,
  Layers,
  Bot,
  Calendar,
  Target,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type UserDetail = {
  profile: {
    id: string;
    name: string | null;
    avatar_url: string | null;
    level: string | null;
    total_xp: number;
    daily_goal_xp: number;
    streak_days: number;
    best_streak: number;
    last_study_date: string | null;
    is_premium: boolean;
    premium_expires_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  auth: {
    email: string | null;
    last_sign_in_at: string | null;
    created_at: string | null;
  };
  counts: {
    total_lessons: number;
    lessons_completed: number;
    total_achievements: number;
    earned_achievements: number;
    srs_total: number;
    srs_due_now: number;
    srs_mastered: number;
    srs_leeches: number;
    listening_attempts: number;
    listening_correct: number;
    listening_accuracy_pct: number;
    ai_sessions: number;
  };
  daily: { date: string; xp_earned: number; lessons_completed: number; cards_reviewed: number }[];
  lesson_progress: {
    lesson_id: string;
    title_uz: string;
    hsk_level: number;
    order_num: number;
    status: string | null;
    score: number | null;
    completed_at: string | null;
  }[];
  earned_achievements: { id: string; code: string; title_uz: string; xp_reward: number; icon: string | null }[];
  struggle_clips: {
    clip_id: string;
    transcript_zh: string;
    transcript_pinyin: string;
    hsk_level: number;
    attempts: number;
    correct: number;
    accuracy_pct: number;
  }[];
};

const DURATIONS = [1, 3, 6, 12];

function initials(name: string | null, email: string | null) {
  const src = (name ?? email ?? "?").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function colorFor(id: string) {
  const palette = ["#DC2626", "#2563EB", "#059669", "#D97706", "#7C3AED", "#DB2777", "#0891B2"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatRelative(iso: string | null) {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (m < 1) return "Hozir";
  if (m < 60) return `${m} daq oldin`;
  if (h < 24) return `${h} soat oldin`;
  if (d < 30) return `${d} kun oldin`;
  return formatDate(iso);
}

export default function UserDetailClient({ detail }: { detail: UserDetail }) {
  const { profile, auth, counts, daily, lesson_progress, earned_achievements, struggle_clips } =
    detail;

  const [busy, setBusy] = useState(false);
  const [premium, setPremium] = useState({
    is_premium: profile.is_premium,
    premium_expires_at: profile.premium_expires_at,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [months, setMonths] = useState(1);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const lessonsByLevel = useMemo(() => {
    const groups: Record<number, typeof lesson_progress> = {};
    lesson_progress.forEach((l) => {
      (groups[l.hsk_level] ??= []).push(l);
    });
    return groups;
  }, [lesson_progress]);

  // Build a 28-day heatmap from daily activity
  const heatmap = useMemo(() => {
    const byDate = new Map<string, number>();
    daily.forEach((d) => byDate.set(d.date, d.xp_earned));
    const out: { date: string; xp: number }[] = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      out.push({ date: key, xp: byDate.get(key) ?? 0 });
    }
    return out;
  }, [daily]);

  function showToast(kind: "ok" | "err", text: string) {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3000);
  }

  async function grantPremium() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/set-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.id, months }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("err", data.error || "Xatolik");
        return;
      }
      setPremium({ is_premium: true, premium_expires_at: data.premium_expires_at });
      showToast("ok", "Premium berildi");
      setModalOpen(false);
    } catch {
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(false);
    }
  }

  async function removePremium() {
    if (!confirm(`${profile.name ?? auth.email} dan premiumni olib qo'yasizmi?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/remove-premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("err", data.error || "Xatolik");
        return;
      }
      setPremium({ is_premium: false, premium_expires_at: null });
      showToast("ok", "Premium olib qo'yildi");
    } catch {
      showToast("err", "Tarmoq xatosi");
    } finally {
      setBusy(false);
    }
  }

  const lessonsPct =
    counts.total_lessons === 0
      ? 0
      : Math.round((counts.lessons_completed / counts.total_lessons) * 100);

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-medium"
                style={{ backgroundColor: colorFor(profile.id) }}
              >
                {initials(profile.name, auth.email)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  {profile.name ?? "—"}
                  {premium.is_premium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 text-xs px-2 py-0.5 font-medium">
                      <Crown className="w-3 h-3" />
                      Premium
                    </span>
                  )}
                </h1>
                <div className="text-sm text-neutral-600 flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  {auth.email ?? "—"}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => {
                    setMonths(1);
                    setModalOpen(true);
                  }}
                  disabled={busy}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                >
                  Premium ber
                </Button>
                {premium.is_premium && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={removePremium}
                    disabled={busy}
                  >
                    Olib qo&apos;y
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-sm">
              <Field label="Ro'yxatdan o'tgan" value={formatDate(auth.created_at)} />
              <Field
                label="So'nggi kirish"
                value={formatRelative(auth.last_sign_in_at)}
              />
              <Field
                label="Premium muddati"
                value={
                  premium.is_premium ? formatDate(premium.premium_expires_at) : "—"
                }
              />
              <Field
                label="So'nggi mashg'ulot"
                value={formatDate(profile.last_study_date)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Trophy className="w-5 h-5 text-amber-500" />}
          tint="bg-amber-500/10"
          value={profile.total_xp.toLocaleString("uz-UZ")}
          label="Jami XP"
        />
        <StatCard
          icon={<Flame className="w-5 h-5 text-orange-500" />}
          tint="bg-orange-500/10"
          value={`${profile.streak_days} kun`}
          label={`Joriy seriya • Eng yaxshi: ${profile.best_streak}`}
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-blue-500" />}
          tint="bg-blue-500/10"
          value={`${counts.lessons_completed} / ${counts.total_lessons}`}
          label={`Darslar (${lessonsPct}%)`}
        />
        <StatCard
          icon={<Headphones className="w-5 h-5 text-emerald-500" />}
          tint="bg-emerald-500/10"
          value={
            counts.listening_attempts === 0
              ? "—"
              : `${counts.listening_accuracy_pct}%`
          }
          label={`Tinglash aniqligi (${counts.listening_attempts} urinish)`}
        />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Layers className="w-5 h-5 text-purple-500" />}
          tint="bg-purple-500/10"
          value={counts.srs_total.toLocaleString("uz-UZ")}
          label={`Kartochkalar • Mukammal: ${counts.srs_mastered}`}
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-red-500" />}
          tint="bg-red-500/10"
          value={counts.srs_due_now.toLocaleString("uz-UZ")}
          label={`Hozir takrorlash • Qiyin: ${counts.srs_leeches}`}
        />
        <StatCard
          icon={<Crown className="w-5 h-5 text-yellow-500" />}
          tint="bg-yellow-500/10"
          value={`${counts.earned_achievements} / ${counts.total_achievements}`}
          label="Yutuqlar"
        />
        <StatCard
          icon={<Bot className="w-5 h-5 text-cyan-500" />}
          tint="bg-cyan-500/10"
          value={counts.ai_sessions.toLocaleString("uz-UZ")}
          label="AI suhbatlari"
        />
      </div>

      {/* Activity heatmap */}
      <Section
        title="So'nggi 28 kun faolligi"
        icon={<Calendar className="w-4 h-4 text-neutral-500" />}
      >
        <div className="grid grid-cols-7 gap-1.5">
          {heatmap.map((d) => (
            <div
              key={d.date}
              title={`${d.date}: ${d.xp} XP`}
              className={`aspect-square rounded ${
                d.xp === 0
                  ? "bg-neutral-100"
                  : d.xp < 20
                    ? "bg-red-100"
                    : d.xp < 50
                      ? "bg-red-300"
                      : d.xp < 100
                        ? "bg-red-500"
                        : "bg-red-700"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-1.5 text-[10px] text-neutral-500 mt-2">
          <span>Kam</span>
          <div className="w-3 h-3 rounded bg-neutral-100" />
          <div className="w-3 h-3 rounded bg-red-100" />
          <div className="w-3 h-3 rounded bg-red-300" />
          <div className="w-3 h-3 rounded bg-red-500" />
          <div className="w-3 h-3 rounded bg-red-700" />
          <span>Ko&apos;p</span>
        </div>
      </Section>

      {/* Lesson progress per HSK level */}
      <Section
        title="Darslar (HSK bo'yicha)"
        icon={<BookOpen className="w-4 h-4 text-neutral-500" />}
      >
        <div className="space-y-5">
          {[1, 2, 3, 4, 5, 6].map((level) => {
            const list = lessonsByLevel[level];
            if (!list || list.length === 0) return null;
            const completed = list.filter((l) => l.status === "completed").length;
            return (
              <div key={level}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">HSK {level}</h3>
                  <span className="text-xs text-neutral-500">
                    {completed} / {list.length}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {list.map((l) => (
                    <div
                      key={l.lesson_id}
                      className={`rounded-md border px-3 py-2 text-sm flex items-center justify-between gap-2 ${
                        l.status === "completed"
                          ? "border-green-200 bg-green-50"
                          : l.status === "in_progress"
                            ? "border-amber-200 bg-amber-50"
                            : "border-neutral-200 bg-white"
                      }`}
                    >
                      <span className="truncate">
                        <span className="text-neutral-400 mr-1.5 tabular-nums">
                          {l.order_num}.
                        </span>
                        {l.title_uz}
                      </span>
                      {l.score !== null && (
                        <span
                          className={`text-xs font-medium tabular-nums shrink-0 ${
                            l.score >= 80
                              ? "text-green-700"
                              : l.score >= 50
                                ? "text-amber-700"
                                : "text-red-700"
                          }`}
                        >
                          {l.score}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Achievements earned */}
      {earned_achievements.length > 0 && (
        <Section
          title="Olingan yutuqlar"
          icon={<Crown className="w-4 h-4 text-neutral-500" />}
        >
          <div className="flex flex-wrap gap-2">
            {earned_achievements.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800"
              >
                <Crown className="w-3 h-3" />
                {a.title_uz}
                <span className="text-amber-600">+{a.xp_reward}</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Struggle clips */}
      {struggle_clips.length > 0 && (
        <Section
          title="Tinglashda qiynaladigan so'zlar"
          icon={<Headphones className="w-4 h-4 text-neutral-500" />}
        >
          <div className="space-y-2">
            {struggle_clips.map((c) => (
              <div
                key={c.clip_id}
                className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-chinese text-lg">{c.transcript_zh}</span>
                  <span className="text-neutral-500 text-xs">{c.transcript_pinyin}</span>
                  <span className="rounded bg-white border border-neutral-200 text-[10px] px-1.5 py-0.5">
                    HSK {c.hsk_level}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-neutral-600">
                    {c.correct} / {c.attempts}
                  </span>
                  <span className="text-red-700 font-semibold tabular-nums">
                    {c.accuracy_pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <p className="text-xs text-neutral-400 flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        Profil yangilangan: {formatRelative(profile.updated_at)}
      </p>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => !busy && setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-1">Premium berish</h2>
            <p className="text-sm text-neutral-600 mb-4">
              {profile.name ?? auth.email ?? profile.id}
            </p>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Muddati
            </label>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {DURATIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`py-2 rounded-md text-sm font-medium border transition-colors ${
                    months === m
                      ? "bg-[#DC2626] text-white border-[#DC2626]"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {m} oy
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={busy}
              >
                Bekor qilish
              </Button>
              <Button
                onClick={grantPremium}
                disabled={busy}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
              >
                {busy ? "Yuborilmoqda..." : "Tasdiqlash"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg text-sm text-white ${
            toast.kind === "ok" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  tint,
  value,
  label,
}: {
  icon: React.ReactNode;
  tint: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${tint}`}>
        {icon}
      </div>
      <p className="text-xl font-bold text-neutral-900 tabular-nums">{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm text-neutral-900 mt-0.5">{value}</p>
    </div>
  );
}
