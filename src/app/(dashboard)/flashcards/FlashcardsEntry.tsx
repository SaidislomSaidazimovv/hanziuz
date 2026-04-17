"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Layers,
  Sparkles,
  Trophy,
  AlertTriangle,
  Calendar,
  Loader2,
  Keyboard,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSrsStats,
  getLessons,
  type DbLesson,
  type SrsStats,
  type FlashcardFilter,
} from "@/lib/db";

export type ReviewMode = "classic" | "typing";

interface Props {
  userId: string;
  onStart: (filter: FlashcardFilter, mode: ReviewMode) => void;
}

const HSK_LEVELS = [1, 2, 3, 4];

export default function FlashcardsEntry({ userId, onStart }: Props) {
  const [stats, setStats] = useState<SrsStats | null>(null);
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hskLevel, setHskLevel] = useState<number | "">("");
  const [lessonId, setLessonId] = useState<string>("");
  const [deckType, setDeckType] = useState<"mixed" | "due" | "leeches">(
    "mixed"
  );
  const [mode, setMode] = useState<ReviewMode>("classic");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      try {
        const [s, l] = await Promise.all([getSrsStats(userId), getLessons()]);
        if (cancelled) return;
        setStats(s);
        setLessons(l);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Ma'lumotlarni yuklab bo'lmadi"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {error ?? "Statistika topilmadi"}
      </div>
    );
  }

  const filteredLessons = hskLevel
    ? lessons.filter((l) => l.hsk_level === Number(hskLevel))
    : lessons;

  const deckTypeEmpty =
    (deckType === "due" && stats.due === 0) ||
    (deckType === "leeches" && stats.leeches === 0);

  function handleStart() {
    const filter: FlashcardFilter = { limit: 15 };
    if (hskLevel) filter.hskLevel = Number(hskLevel);
    if (lessonId) filter.lessonId = lessonId;
    if (deckType === "due") filter.dueOnly = true;
    if (deckType === "leeches") filter.leechesOnly = true;
    onStart(filter, mode);
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Layers className="w-7 h-7 text-primary" />
          Kartochkalar
        </h1>
        <p className="text-muted-foreground mt-1">
          So&apos;zlarni takrorlang va yangilarini o&apos;rganing
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Flame className="w-5 h-5 text-red-500" />}
          value={stats.due}
          label="Muddati o'tgan"
          tint="bg-red-500/10"
          highlight={stats.due > 0}
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5 text-blue-500" />}
          value={stats.newCount}
          label="Yangi so'zlar"
          tint="bg-blue-500/10"
        />
        <StatCard
          icon={<Layers className="w-5 h-5 text-primary" />}
          value={stats.learned}
          label="O'rganilgan"
          tint="bg-primary/10"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5 text-amber-500" />}
          value={stats.mastered}
          label="Mukammal"
          tint="bg-amber-500/10"
        />
      </div>

      {/* Forecast + today */}
      <div className="rounded-2xl border bg-card p-4">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <ForecastItem
            icon={<Calendar className="w-4 h-4" />}
            label="Bugun"
            value={`${stats.reviewedToday} ta`}
            sub="ko'rib chiqildi"
          />
          <ForecastItem
            icon={<Calendar className="w-4 h-4" />}
            label="Ertaga"
            value={`${stats.tomorrowDue} ta`}
            sub="takrorlash kerak"
          />
          <ForecastItem
            icon={<Calendar className="w-4 h-4" />}
            label="Bir haftada"
            value={`${stats.weekDue} ta`}
            sub="kutilmoqda"
          />
        </div>
      </div>

      {/* Leech warning */}
      {stats.leeches > 0 && (
        <button
          onClick={() => setDeckType("leeches")}
          className="w-full rounded-2xl border border-red-500/30 bg-red-500/5 p-4 flex items-center gap-3 text-left hover:bg-red-500/10 transition-colors"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-600">
              {stats.leeches} ta qiyin so&apos;z
            </p>
            <p className="text-xs text-muted-foreground">
              Bir necha marta xato qilingan. Ustivor takrorlash tavsiya etiladi.
            </p>
          </div>
          <span className="text-xs font-medium text-red-600 shrink-0">
            Tanlash →
          </span>
        </button>
      )}

      {/* Deck type selector */}
      <div>
        <label className="block text-sm font-semibold mb-2">Deck turi</label>
        <div className="grid grid-cols-3 gap-2">
          <DeckTypeBtn
            active={deckType === "mixed"}
            onClick={() => setDeckType("mixed")}
            label="Aralash"
            sub="Muddati o'tgan + yangi"
          />
          <DeckTypeBtn
            active={deckType === "due"}
            onClick={() => setDeckType("due")}
            label="Faqat muddati o'tgan"
            sub={`${stats.due} ta mavjud`}
            disabled={stats.due === 0}
          />
          <DeckTypeBtn
            active={deckType === "leeches"}
            onClick={() => setDeckType("leeches")}
            label="Qiyin so'zlar"
            sub={`${stats.leeches} ta mavjud`}
            disabled={stats.leeches === 0}
            accent="red"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5">HSK daraja</label>
          <select
            value={hskLevel}
            onChange={(e) => {
              setHskLevel(e.target.value === "" ? "" : Number(e.target.value));
              setLessonId("");
            }}
            className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Barcha darajalar</option>
            {HSK_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                HSK {lvl}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Dars</label>
          <select
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            className="w-full rounded-xl border bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Barcha darslar</option>
            {filteredLessons.map((l) => (
              <option key={l.id} value={l.id}>
                HSK {l.hsk_level} — {l.title_uz}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode picker */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Mashg&apos;ulot turi
        </label>
        <div className="grid grid-cols-2 gap-2">
          <ModeBtn
            active={mode === "classic"}
            onClick={() => setMode("classic")}
            icon={<Keyboard className="w-4 h-4" />}
            label="Klassik"
            sub="Aylantir → baho ber"
          />
          <ModeBtn
            active={mode === "typing"}
            onClick={() => setMode("typing")}
            icon={<Edit3 className="w-4 h-4" />}
            label="Yozish"
            sub="Javobni yozing"
          />
        </div>
      </div>

      {/* Start */}
      <Button
        size="lg"
        onClick={handleStart}
        disabled={deckTypeEmpty}
        className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base"
      >
        {deckTypeEmpty
          ? "Bu deckda kartochka yo'q"
          : "Mashg'ulotni boshlash"}
      </Button>
    </motion.div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tint,
  highlight,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  tint: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-4",
        highlight && "ring-2 ring-red-500/30"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
          tint
        )}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold">{value.toLocaleString("uz-UZ")}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function ForecastItem({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function DeckTypeBtn({
  active,
  onClick,
  label,
  sub,
  disabled,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
  disabled?: boolean;
  accent?: "red";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? accent === "red"
            ? "border-red-500 bg-red-500/10"
            : "border-primary bg-primary/10"
          : "bg-card hover:bg-secondary/50"
      )}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </button>
  );
}

function ModeBtn({
  active,
  onClick,
  icon,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border p-3 text-left transition-colors flex items-start gap-3",
        active ? "border-primary bg-primary/10" : "bg-card hover:bg-secondary/50"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          active ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub}</p>
      </div>
    </button>
  );
}
