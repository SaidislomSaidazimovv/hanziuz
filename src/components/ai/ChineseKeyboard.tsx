"use client";

import { useState } from "react";
import { Keyboard, X } from "lucide-react";
import { cn } from "@/lib/utils";

const commonChars = [
  // Row 1: pronouns & basics
  ["我", "你", "他", "她", "们", "的", "是", "不", "在", "有"],
  // Row 2: common verbs
  ["去", "来", "说", "看", "听", "吃", "喝", "做", "想", "会"],
  // Row 3: common words
  ["好", "大", "小", "多", "少", "很", "也", "都", "了", "吗"],
  // Row 4: nouns & misc
  ["人", "中", "国", "学", "生", "老", "师", "家", "书", "字"],
];

interface ChineseKeyboardProps {
  onInsert: (char: string) => void;
}

export default function ChineseKeyboard({ onInsert }: ChineseKeyboardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
          isOpen
            ? "bg-primary text-primary-foreground"
            : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
        )}
        aria-label="Xitoy klaviaturasi"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Keyboard className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 right-0 min-w-[320px] p-3 rounded-2xl border bg-card shadow-xl z-10">
          <p className="text-[10px] text-muted-foreground mb-2 text-center">
            Ieroglifni bosing
          </p>
          <div className="space-y-1.5">
            {commonChars.map((row, ri) => (
              <div key={ri} className="flex gap-1 justify-center">
                {row.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => onInsert(char)}
                    className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary text-sm font-chinese transition-colors flex items-center justify-center"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
