-- 020: Listening module — audio clips, exercises, per-user progress
-- Supports word_choice, tone_choice, and comprehension exercises.
-- Audio files live in the "listening-audio" Supabase Storage bucket (public).

-- Audio clip registry: one row per recorded/generated MP3.
CREATE TABLE IF NOT EXISTS public.listening_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_url TEXT NOT NULL,
  transcript_zh TEXT NOT NULL,
  transcript_pinyin TEXT NOT NULL,
  translation_uz TEXT NOT NULL,
  duration_seconds INT,
  hsk_level INT CHECK (hsk_level BETWEEN 1 AND 9),
  clip_type TEXT CHECK (clip_type IN ('word', 'sentence', 'dialog')),
  speaker TEXT NOT NULL,              -- e.g. 'tts-edge-xiaoxiao'
  vocab_id UUID REFERENCES public.vocabulary(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listening_clips_level
  ON public.listening_clips(hsk_level, clip_type);
CREATE INDEX IF NOT EXISTS idx_listening_clips_vocab
  ON public.listening_clips(vocab_id);

-- Exercises reference a clip + pose a question about it.
CREATE TABLE IF NOT EXISTS public.listening_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id UUID REFERENCES public.listening_clips(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  exercise_type TEXT CHECK (exercise_type IN ('word_choice', 'tone_choice', 'comprehension')),
  question_uz TEXT NOT NULL,
  options JSONB NOT NULL,             -- ["你好","谢谢","再见","请"]
  correct_answer TEXT NOT NULL,       -- "你好"
  order_num INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listening_exercises_lesson
  ON public.listening_exercises(lesson_id, order_num);
CREATE INDEX IF NOT EXISTS idx_listening_exercises_clip
  ON public.listening_exercises(clip_id);

-- Per-user progress on exercises.
CREATE TABLE IF NOT EXISTS public.user_listening_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.listening_exercises(id) ON DELETE CASCADE,
  attempts INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_user_listening_user
  ON public.user_listening_progress(user_id);

-- RLS
ALTER TABLE public.listening_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_listening_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listening clips"
  ON public.listening_clips FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view listening exercises"
  ON public.listening_exercises FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can view own listening progress"
  ON public.user_listening_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own listening progress"
  ON public.user_listening_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listening progress"
  ON public.user_listening_progress FOR UPDATE
  USING (auth.uid() = user_id);
