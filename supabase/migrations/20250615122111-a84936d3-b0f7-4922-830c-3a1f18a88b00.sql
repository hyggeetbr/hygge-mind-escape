
-- Articles table for reading suggestions
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  summary TEXT,
  estimated_read_minutes INTEGER CHECK (estimated_read_minutes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sessions table for tracking reading time per user/article/day
CREATE TABLE IF NOT EXISTS public.reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on reading_sessions (not needed for articles which are public)
ALTER TABLE public.reading_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own reading sessions
CREATE POLICY "Users can view their own reading sessions"
  ON public.reading_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert reading sessions for themselves
CREATE POLICY "Users can insert their own reading sessions"
  ON public.reading_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reading sessions
CREATE POLICY "Users can update their own reading sessions"
  ON public.reading_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own reading sessions
CREATE POLICY "Users can delete their own reading sessions"
  ON public.reading_sessions
  FOR DELETE
  USING (auth.uid() = user_id);
