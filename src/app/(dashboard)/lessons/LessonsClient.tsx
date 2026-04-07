"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { lessons, mockProgress } from "@/lib/seed-data";
import LessonCard from "@/components/lessons/LessonCard";

const hskLevels = [
  { level: 0, label: "Barchasi" },
  { level: 1, label: "HSK 1" },
  { level: 2, label: "HSK 2" },
  { level: 3, label: "HSK 3" },
  { level: 4, label: "HSK 4" },
  { level: 5, label: "HSK 5" },
  { level: 6, label: "HSK 6" },
];

export default function LessonsClient() {
  const [activeLevel, setActiveLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessons = useMemo(() => {
    let result = lessons;

    if (activeLevel > 0) {
      result = result.filter((l) => l.hskLevel === activeLevel);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.titleUz.toLowerCase().includes(q) ||
          l.titleZh.includes(q) ||
          l.hanziPreview.includes(q) ||
          l.descriptionUz.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeLevel, searchQuery]);

  const levelCounts = useMemo(() => {
    const counts: Record<number, number> = { 0: lessons.length };
    lessons.forEach((l) => {
      counts[l.hskLevel] = (counts[l.hskLevel] || 0) + 1;
    });
    return counts;
  }, []);

  const completedCount = mockProgress.filter(
    (p) => p.status === "completed"
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Darslar</h1>
        </div>
        <p className="text-muted-foreground">
          {completedCount} / {lessons.length} dars yakunlangan
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="So'z yoki dars qidirish (o'zbekcha yoki xitoycha)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 rounded-xl h-11 bg-card"
        />
      </div>

      {/* HSK Level Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        {hskLevels.map((tab) => (
          <button
            key={tab.level}
            onClick={() => setActiveLevel(tab.level)}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all",
              activeLevel === tab.level
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {tab.label}
            {levelCounts[tab.level] ? (
              <Badge
                variant="outline"
                className={cn(
                  "ml-1.5 text-[10px] px-1.5 py-0",
                  activeLevel === tab.level
                    ? "border-primary-foreground/30 text-primary-foreground"
                    : "border-border"
                )}
              >
                {levelCounts[tab.level] || 0}
              </Badge>
            ) : null}
          </button>
        ))}
      </div>

      {/* Lesson list */}
      {filteredLessons.length > 0 ? (
        <div className="grid gap-3">
          {filteredLessons.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progress={mockProgress.find((p) => p.lessonId === lesson.id)}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {searchQuery
              ? `"${searchQuery}" bo'yicha dars topilmadi`
              : "Bu daraja uchun darslar hali mavjud emas"}
          </p>
        </div>
      )}
    </div>
  );
}
