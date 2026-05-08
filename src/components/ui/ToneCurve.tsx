import { TONE_COLORS, TONE_LABELS, type Tone } from "@/lib/tones";
import { cn } from "@/lib/utils";

// SVG paths inside a 100×60 viewBox. Y axis: 0 = top (high pitch), 60 = bottom
// (low pitch). The curves match the standard Mandarin pitch contour diagrams
// found in textbooks.
const TONE_PATHS: Record<Tone, string> = {
  // Tone 1 — high level (ā)
  1: "M 8 14 L 92 14",
  // Tone 2 — rising from mid to high (á)
  2: "M 8 48 Q 30 38, 92 12",
  // Tone 3 — dips low then rises slightly (ǎ). A smooth U-curve.
  3: "M 8 26 C 30 60, 70 60, 92 32",
  // Tone 4 — falls sharply from high to low (à)
  4: "M 8 12 L 92 48",
  // Neutral — short flat dash near mid-pitch
  5: "M 40 32 L 60 32",
};

interface ToneCurveProps {
  tone: Tone;
  /** Width in px. Height is auto-derived from the 100×60 viewBox (≈ width × 0.6). */
  width?: number;
  className?: string;
  /** Show a small numeric label next to the curve. */
  showNumber?: boolean;
}

/**
 * Single-tone visualizer. Renders a smooth SVG curve representing the pitch
 * contour of one Mandarin tone. The shape comes directly from textbook
 * convention (T1 high-level, T2 rising, T3 low-dipping, T4 falling).
 */
export default function ToneCurve({
  tone,
  width = 40,
  className,
  showNumber = false,
}: ToneCurveProps) {
  const height = Math.round(width * 0.6);
  const color = TONE_COLORS[tone];
  const label = TONE_LABELS[tone];
  return (
    <span
      className={cn("inline-flex items-center gap-1 align-middle", className)}
      title={label}
    >
      <svg
        viewBox="0 0 100 60"
        width={width}
        height={height}
        role="img"
        aria-label={label}
        className="shrink-0"
      >
        {/* faint mid-pitch baseline */}
        <line
          x1="6"
          y1="30"
          x2="94"
          y2="30"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.18"
        />
        <path
          d={TONE_PATHS[tone]}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showNumber && tone !== 5 && (
        <span
          className="text-[10px] font-bold tabular-nums leading-none"
          style={{ color }}
        >
          {tone}
        </span>
      )}
    </span>
  );
}

/**
 * Multi-syllable tone display. Splits a pinyin string into syllables and
 * renders one ToneCurve per syllable, side by side.
 */
export function TonesDisplay({
  tones,
  width = 36,
  showNumbers = false,
  className,
}: {
  tones: Tone[];
  width?: number;
  showNumbers?: boolean;
  className?: string;
}) {
  if (tones.length === 0) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 align-middle", className)}>
      {tones.map((t, i) => (
        <ToneCurve key={i} tone={t} width={width} showNumber={showNumbers} />
      ))}
    </span>
  );
}
