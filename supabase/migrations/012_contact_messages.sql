-- 012: Contact messages

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  subject VARCHAR,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);
