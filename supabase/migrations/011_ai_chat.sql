-- 011: AI Chat sessions and messages

CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR DEFAULT 'Yangi suhbat',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user ON public.ai_chat_sessions(user_id, updated_at DESC);
CREATE INDEX idx_chat_messages_session ON public.ai_chat_messages(session_id, created_at);

ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own sessions" ON public.ai_chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own messages" ON public.ai_chat_messages
  FOR ALL USING (
    session_id IN (
      SELECT id FROM public.ai_chat_sessions
      WHERE user_id = auth.uid()
    )
  );
