-- 001: Create missing tables
-- Run FIRST before any seed files

-- Lesson-Vocabulary many-to-many link table
CREATE TABLE IF NOT EXISTS public.lesson_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE,
  vocab_id UUID REFERENCES public.vocabulary ON DELETE CASCADE,
  order_num INT DEFAULT 0,
  UNIQUE(lesson_id, vocab_id)
);

-- Quizzes (one quiz per lesson)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE,
  title_uz VARCHAR NOT NULL,
  total_questions INT DEFAULT 0,
  pass_score INT DEFAULT 60,
  time_limit_seconds INT DEFAULT 180,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes ON DELETE CASCADE,
  question_type VARCHAR DEFAULT 'multiple_choice',
  question_uz TEXT NOT NULL,
  correct_answer VARCHAR NOT NULL,
  options JSONB NOT NULL,
  order_num INT DEFAULT 0
);

-- Achievements
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR UNIQUE NOT NULL,
  title_uz VARCHAR NOT NULL,
  description_uz TEXT,
  xp_reward INT DEFAULT 0,
  condition_type VARCHAR,
  condition_value INT DEFAULT 0,
  icon VARCHAR DEFAULT 'trophy'
);

-- User Achievements (tracks which user earned which achievement)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- RLS Policies
ALTER TABLE public.lesson_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Public read for lessons/quizzes/achievements
CREATE POLICY "Anyone can view lesson_vocabulary"
  ON public.lesson_vocabulary FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view quizzes"
  ON public.quizzes FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view quiz_questions"
  ON public.quiz_questions FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Anyone can view achievements"
  ON public.achievements FOR SELECT
  TO authenticated, anon
  USING (true);

-- User achievements: users own their data
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
