import {
  reviewCard,
  createNewCard,
  isDueForReview,
  type SRSCard,
} from "@/lib/srs-algorithm";

function cardWith(overrides: Partial<SRSCard> = {}): SRSCard {
  return {
    vocabId: "v1",
    easeFactor: 2.5,
    intervalDays: 6,
    repetitions: 3,
    nextReviewAt: new Date(),
    lastReviewedAt: new Date(),
    ...overrides,
  };
}

describe("SRS Algorithm — reviewCard", () => {
  it("resets to interval 1 for rating 'again' (forgot)", () => {
    const res = reviewCard(cardWith({ intervalDays: 30, repetitions: 5 }), "again");
    expect(res.intervalDays).toBe(1);
    expect(res.repetitions).toBe(0);
  });

  it("increases interval for rating 'good'", () => {
    const res = reviewCard(cardWith({ intervalDays: 6, repetitions: 3 }), "good");
    expect(res.intervalDays).toBeGreaterThan(6);
    expect(res.repetitions).toBe(4);
  });

  it("sets interval to 1 on first successful review", () => {
    const res = reviewCard(cardWith({ repetitions: 0 }), "good");
    expect(res.intervalDays).toBe(1);
    expect(res.repetitions).toBe(1);
  });

  it("sets interval to 3 on second successful review", () => {
    const res = reviewCard(cardWith({ repetitions: 1 }), "good");
    expect(res.intervalDays).toBe(3);
    expect(res.repetitions).toBe(2);
  });

  it("adjusts ease factor up on 'good'", () => {
    const res = reviewCard(cardWith({ easeFactor: 2.5 }), "good");
    expect(res.easeFactor).toBeGreaterThan(2.5);
  });

  it("adjusts ease factor down on 'again'", () => {
    const res = reviewCard(cardWith({ easeFactor: 2.5 }), "again");
    expect(res.easeFactor).toBeLessThan(2.5);
  });

  it("never sets interval below 1 for hard rating", () => {
    const res = reviewCard(cardWith({ intervalDays: 1, repetitions: 1 }), "hard");
    expect(res.intervalDays).toBeGreaterThanOrEqual(1);
  });

  it("never sets ease factor below 1.3", () => {
    let card = cardWith({ easeFactor: 1.3 });
    for (let i = 0; i < 10; i++) {
      const res = reviewCard(card, "again");
      card = { ...card, ...res, lastReviewedAt: new Date() };
      expect(res.easeFactor).toBeGreaterThanOrEqual(1.3);
    }
  });

  it("computes nextReviewAt based on interval", () => {
    const res = reviewCard(cardWith({ intervalDays: 1, repetitions: 1 }), "good");
    const diff = res.nextReviewAt.getTime() - Date.now();
    expect(diff).toBeGreaterThan(0);
  });
});

describe("createNewCard", () => {
  it("creates card with default ease factor 2.5", () => {
    const card = createNewCard("abc");
    expect(card.easeFactor).toBe(2.5);
    expect(card.intervalDays).toBe(1);
    expect(card.repetitions).toBe(0);
    expect(card.vocabId).toBe("abc");
  });
});

describe("isDueForReview", () => {
  it("returns true when nextReviewAt is in the past", () => {
    const card = cardWith({ nextReviewAt: new Date(Date.now() - 1000) });
    expect(isDueForReview(card)).toBe(true);
  });

  it("returns false when nextReviewAt is in the future", () => {
    const card = cardWith({ nextReviewAt: new Date(Date.now() + 86400000) });
    expect(isDueForReview(card)).toBe(false);
  });
});
