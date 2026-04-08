-- 013: Premium subscription fields

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS
  is_premium BOOLEAN DEFAULT false;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS
  premium_expires_at TIMESTAMPTZ DEFAULT NULL;
