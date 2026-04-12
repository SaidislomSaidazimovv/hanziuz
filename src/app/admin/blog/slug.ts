const REPLACEMENTS: [RegExp, string][] = [
  [/[oʻ'ʼ’']/gi, ""],
  [/ʻ/g, ""],
  [/ч/gi, "ch"],
  [/ш/gi, "sh"],
  [/ў/gi, "o"],
  [/ғ/gi, "g"],
  [/қ/gi, "q"],
  [/ҳ/gi, "h"],
];

export function slugify(text: string): string {
  let s = text.trim().toLowerCase();
  for (const [re, to] of REPLACEMENTS) s = s.replace(re, to);
  s = s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, ""); // strip diacritics
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.replace(/\s+/g, "-").replace(/-+/g, "-");
  return s.replace(/^-|-$/g, "");
}
