
-- Create tables for goal tracking
CREATE TABLE public.long_term_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.short_term_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.long_term_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_term_goals ENABLE ROW LEVEL SECURITY;

-- Create policies for long_term_goals
CREATE POLICY "Users can view their own long term goals" 
  ON public.long_term_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own long term goals" 
  ON public.long_term_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own long term goals" 
  ON public.long_term_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own long term goals" 
  ON public.long_term_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for short_term_goals
CREATE POLICY "Users can view their own short term goals" 
  ON public.short_term_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own short term goals" 
  ON public.short_term_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own short term goals" 
  ON public.short_term_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own short term goals" 
  ON public.short_term_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);
