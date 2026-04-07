-- HanziUz Database Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query

-- Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name VARCHAR,
  avatar_url VARCHAR,
  level VARCHAR DEFAULT 'beginner',
  streak_days INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  last_study_date DATE,
  total_xp INT DEFAULT 0,
  daily_goal_xp INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Lessons
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_uz VARCHAR NOT NULL,
  title_zh VARCHAR,
  description_uz TEXT,
  hsk_level INT CHECK (hsk_level BETWEEN 1 AND 6),
  order_num INT,
  is_free BOOLEAN DEFAULT false,
  thumbnail_url VARCHAR,
  content JSONB,
  xp_reward INT DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vocabulary
CREATE TABLE public.vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hanzi VARCHAR NOT NULL,
  pinyin VARCHAR NOT NULL,
  meaning_uz VARCHAR NOT NULL,
  meaning_en VARCHAR,
  audio_url VARCHAR,
  hsk_level INT,
  example_sentence_zh VARCHAR,
  example_sentence_uz VARCHAR,
  stroke_order JSONB
);

-- User lesson progress
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE,
  status VARCHAR DEFAULT 'not_started',
  score INT,
  attempts INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- SRS flashcard reviews
CREATE TABLE public.srs_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  vocab_id UUID REFERENCES public.vocabulary ON DELETE CASCADE,
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INT DEFAULT 1,
  repetitions INT DEFAULT 0,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  UNIQUE(user_id, vocab_id)
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Lessons: everyone can read
CREATE POLICY "Anyone can view lessons"
  ON public.lessons FOR SELECT
  TO authenticated, anon
  USING (true);

-- Vocabulary: everyone can read
CREATE POLICY "Anyone can view vocabulary"
  ON public.vocabulary FOR SELECT
  TO authenticated, anon
  USING (true);

-- User lesson progress: users own their data
CREATE POLICY "Users can view own progress"
  ON public.user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- SRS reviews: users own their data
CREATE POLICY "Users can view own reviews"
  ON public.srs_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
  ON public.srs_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.srs_reviews FOR UPDATE
  USING (auth.uid() = user_id);
