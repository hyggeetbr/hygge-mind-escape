
-- Create a table to store family relationships
CREATE TABLE public.user_families (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  family_member_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, family_member_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_families ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own family relationships
CREATE POLICY "Users can view their own family relationships" 
  ON public.user_families 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = family_member_id);

-- Create policy that allows users to create their own family relationships
CREATE POLICY "Users can create their own family relationships" 
  ON public.user_families 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to delete their own family relationships
CREATE POLICY "Users can delete their own family relationships" 
  ON public.user_families 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add a streak_count column to user_profiles for tracking streaks
ALTER TABLE public.user_profiles 
ADD COLUMN streak_count INTEGER DEFAULT 0;
