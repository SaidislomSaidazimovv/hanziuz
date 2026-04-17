-- 017: Add lapses column to srs_reviews for leech detection
-- A "leech" is a card the user keeps forgetting (lapses >= 3).

ALTER TABLE public.srs_reviews
  ADD COLUMN IF NOT EXISTS lapses INT DEFAULT 0;

-- Lapses are incremented every time a user rates "again" on a card.
-- This is separate from `repetitions`, which tracks consecutive successes.
