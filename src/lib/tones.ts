// Mandarin tones — shared utilities used by ToneCurve, listening, flashcards.

export type Tone = 1 | 2 | 3 | 4 | 5;

const TONE_MAP: Record<string, 1 | 2 | 3 | 4> = {
  ā: 1, ē: 1, ī: 1, ō: 1, ū: 1, "ǖ": 1,
  á: 2, é: 2, í: 2, ó: 2, ú: 2, "ǘ": 2,
  ǎ: 3, ě: 3, ǐ: 3, ǒ: 3, ǔ: 3, "ǚ": 3,
  à: 4, è: 4, ì: 4, ò: 4, ù: 4, "ǜ": 4,
};

/**
 * Extracts the tone number (1-4) from a single pinyin syllable's tone mark.
 * Returns 5 for neutral (no diacritic).
 */
export function extractTone(pinyinSyllable: string): Tone {
  for (const ch of pinyinSyllable) {
    const t = TONE_MAP[ch];
    if (t) return t;
  }
  return 5;
}

/**
 * Splits a multi-syllable pinyin string and returns the tone of each syllable.
 * Handles whitespace-separated syllables ("nǐ hǎo") and tightly-joined ones
 * ("nǐhǎo") by also splitting on detected tone marks. Empty syllables are dropped.
 */
export function extractTones(pinyin: string): Tone[] {
  // Try whitespace split first; if only one chunk and it contains multiple
  // tone marks, fall through to mark-based split.
  const trimmed = pinyin.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/\s+/);
  if (parts.length > 1) return parts.map(extractTone);

  // Single chunk — split on tone-mark boundaries.
  const tones: Tone[] = [];
  let current = "";
  for (const ch of trimmed) {
    current += ch;
    if (TONE_MAP[ch]) {
      tones.push(extractTone(current));
      current = "";
    }
  }
  // Trailing syllable without a tone mark = neutral
  if (current.trim()) tones.push(5);
  return tones.length > 0 ? tones : [extractTone(trimmed)];
}

export const TONE_LABELS: Record<Tone, string> = {
  1: "1-ohang (yuqori, tekis)",
  2: "2-ohang (ko'tariluvchi)",
  3: "3-ohang (pasayib-ko'tariluvchi)",
  4: "4-ohang (tushuvchi)",
  5: "Yengil ohang",
};

export const TONE_COLORS: Record<Tone, string> = {
  1: "#0EA5E9", // sky-500
  2: "#F59E0B", // amber-500
  3: "#10B981", // emerald-500
  4: "#DC2626", // brand red — fits the sharp falling character of tone 4
  5: "#9CA3AF", // gray-400
};
