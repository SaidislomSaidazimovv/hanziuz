"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";

interface SearchResult {
  type: "lesson" | "vocab";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  hanzi?: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const q = query.trim().toLowerCase();

      // Search lessons
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("id, title_uz, title_zh, hsk_level, order_num")
        .or(`title_uz.ilike.%${q}%,title_zh.ilike.%${q}%`)
        .limit(5);

      // Search vocabulary
      const { data: vocabData } = await supabase
        .from("vocabulary")
        .select("id, hanzi, pinyin, meaning_uz, meaning_en, hsk_level")
        .or(`hanzi.ilike.%${q}%,pinyin.ilike.%${q}%,meaning_uz.ilike.%${q}%,meaning_en.ilike.%${q}%`)
        .limit(8);

      const searchResults: SearchResult[] = [];

      (lessonData || []).forEach((l: { id: string; title_uz: string; title_zh: string | null; hsk_level: number }) => {
        searchResults.push({
          type: "lesson",
          id: l.id,
          title: l.title_uz,
          subtitle: `HSK ${l.hsk_level} · ${l.title_zh || ""}`,
          href: `/lessons/${l.id}`,
          hanzi: l.title_zh?.slice(0, 2),
        });
      });

      (vocabData || []).forEach((v: { id: string; hanzi: string; pinyin: string; meaning_uz: string; hsk_level: number }) => {
        searchResults.push({
          type: "vocab",
          id: v.id,
          title: `${v.hanzi} — ${v.meaning_uz}`,
          subtitle: `${v.pinyin} · HSK ${v.hsk_level}`,
          href: `/flashcards`,
          hanzi: v.hanzi,
        });
      });

      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    router.push(result.href);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="So'z yoki dars qidirish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pl-9 pr-8 rounded-xl h-9 bg-secondary border-0 w-full"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setIsOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-2xl border bg-card shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="py-1">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      result.type === "lesson" ? "bg-primary/10" : "bg-accent/10"
                    )}
                  >
                    {result.hanzi ? (
                      <span className="font-chinese text-sm">
                        {result.hanzi}
                      </span>
                    ) : (
                      <BookOpen className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0",
                      result.type === "lesson"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    )}
                  >
                    {result.type === "lesson" ? "Dars" : "So'z"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
