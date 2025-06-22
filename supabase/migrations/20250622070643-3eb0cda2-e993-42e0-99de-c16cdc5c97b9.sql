
-- Create table for chat sessions
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create table for chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions"
  ON public.chat_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat sessions"
  ON public.chat_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
  ON public.chat_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
  ON public.chat_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for chat_messages
CREATE POLICY "Users can view messages from their own chat sessions"
  ON public.chat_messages
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create messages in their own chat sessions"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update messages in their own chat sessions"
  ON public.chat_messages
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete messages from their own chat sessions"
  ON public.chat_messages
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.chat_sessions 
    WHERE id = session_id AND user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_updated_at ON public.chat_sessions(updated_at DESC);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
