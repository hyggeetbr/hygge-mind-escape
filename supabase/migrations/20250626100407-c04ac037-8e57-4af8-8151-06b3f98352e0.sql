
-- Create article_likes table
CREATE TABLE public.article_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Create article_comments table
CREATE TABLE public.article_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create article_saves table
CREATE TABLE public.article_saves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Create article_reads table
CREATE TABLE public.article_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for article_likes
ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all article likes" 
  ON public.article_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own article likes" 
  ON public.article_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own article likes" 
  ON public.article_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for article_comments
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all article comments" 
  ON public.article_comments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own article comments" 
  ON public.article_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own article comments" 
  ON public.article_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own article comments" 
  ON public.article_comments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for article_saves
ALTER TABLE public.article_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own article saves" 
  ON public.article_saves 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own article saves" 
  ON public.article_saves 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own article saves" 
  ON public.article_saves 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for article_reads
ALTER TABLE public.article_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all article reads" 
  ON public.article_reads 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own article reads" 
  ON public.article_reads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
