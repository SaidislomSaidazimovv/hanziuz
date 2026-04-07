-- 009: Daily activity tracking for heatmap

CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_earned INT DEFAULT 0,
  lessons_completed INT DEFAULT 0,
  cards_reviewed INT DEFAULT 0,
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_activity_user ON public.daily_activity(user_id, date DESC);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily_activity"
  ON public.daily_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily_activity"
  ON public.daily_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily_activity"
  ON public.daily_activity FOR UPDATE
  USING (auth.uid() = user_id);
