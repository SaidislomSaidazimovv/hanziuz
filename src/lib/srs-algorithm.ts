// SM-2 Spaced Repetition Algorithm
// Based on SuperMemo 2 with minor adjustments for language learning

export type SRSRating = "again" | "hard" | "good";

export interface SRSCard {
  vocabId: string;
  easeFactor: number; // >= 1.3, default 2.5
  intervalDays: number; // days until next review
  repetitions: number; // successful consecutive reviews
  nextReviewAt: Date;
  lastReviewedAt: Date | null;
}

export interface SRSResult {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: Date;
}

const RATING_QUALITY: Record<SRSRating, number> = {
  again: 0, // "Bilmayman" — complete fail
  hard: 3, // "Qiyin" — correct but difficult
  good: 5, // "Bilaman" — easy recall
};

export function reviewCard(card: SRSCard, rating: SRSRating): SRSResult {
  const quality = RATING_QUALITY[rating];
  const now = new Date();

  let { easeFactor, intervalDays, repetitions } = card;

  if (quality < 3) {
    // Failed — reset to beginning
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Successful review
    repetitions += 1;

    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  // "Hard" gets a shorter interval multiplier
  if (rating === "hard") {
    intervalDays = Math.max(1, Math.round(intervalDays * 0.7));
  }

  const nextReviewAt = new Date(now.getTime() + intervalDays * 86400000);

  return { easeFactor, intervalDays, repetitions, nextReviewAt };
}

export function createNewCard(vocabId: string): SRSCard {
  return {
    vocabId,
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
    nextReviewAt: new Date(),
    lastReviewedAt: null,
  };
}

export function isDueForReview(card: SRSCard): boolean {
  return new Date() >= card.nextReviewAt;
}
