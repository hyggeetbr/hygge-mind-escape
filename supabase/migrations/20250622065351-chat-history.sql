-- Add conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Each conversation belongs to a user
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversation messages" ON public.conversation_messages
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.conversations c WHERE c.id = conversation_messages.conversation_id));

CREATE POLICY "Users can insert their own conversation messages" ON public.conversation_messages
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.conversations c WHERE c.id = conversation_id));

CREATE POLICY "Users can update their own conversation messages" ON public.conversation_messages
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.conversations c WHERE c.id = conversation_messages.conversation_id));

CREATE POLICY "Users can delete their own conversation messages" ON public.conversation_messages
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.conversations c WHERE c.id = conversation_messages.conversation_id));

