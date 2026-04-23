-- 021: Refactor user_listening_progress — track per-clip, not per-exercise
-- Exercises are generated dynamically client-side, so we track which clips
-- a user has heard and whether they answered correctly per mode.

DROP TABLE IF EXISTS public.user_listening_progress;

CREATE TABLE public.user_listening_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  clip_id UUID REFERENCES public.listening_clips(id) ON DELETE CASCADE,
  mode TEXT CHECK (mode IN ('word', 'tone')) NOT NULL,
  attempts INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, clip_id, mode)
);

CREATE INDEX idx_user_listening_user
  ON public.user_listening_progress(user_id);
CREATE INDEX idx_user_listening_clip
  ON public.user_listening_progress(clip_id);

ALTER TABLE public.user_listening_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own listening progress"
  ON public.user_listening_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own listening progress"
  ON public.user_listening_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listening progress"
  ON public.user_listening_progress FOR UPDATE
  USING (auth.uid() = user_id);
