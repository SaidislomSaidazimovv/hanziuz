-- 018: Trigram indexes for fast ILIKE search on vocabulary + lessons
-- PostgREST's ILIKE operator uses these automatically when available.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_vocabulary_hanzi_trgm
  ON public.vocabulary USING gin (hanzi gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vocabulary_pinyin_trgm
  ON public.vocabulary USING gin (pinyin gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vocabulary_meaning_uz_trgm
  ON public.vocabulary USING gin (meaning_uz gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vocabulary_meaning_en_trgm
  ON public.vocabulary USING gin (meaning_en gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_lessons_title_uz_trgm
  ON public.lessons USING gin (title_uz gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_lessons_title_zh_trgm
  ON public.lessons USING gin (title_zh gin_trgm_ops);
