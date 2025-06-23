
-- Create a table to track daily user activities
CREATE TABLE public.daily_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meditation_minutes INTEGER DEFAULT 0 NOT NULL,
  yoga_minutes INTEGER DEFAULT 0 NOT NULL,
  reading_minutes INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for daily_activities
CREATE POLICY "Users can view their own daily activities" 
  ON public.daily_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activities" 
  ON public.daily_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activities" 
  ON public.daily_activities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a function to get or create today's activity record
CREATE OR REPLACE FUNCTION public.get_or_create_daily_activity(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_id UUID;
BEGIN
  -- Try to get existing record for today
  SELECT id INTO activity_id
  FROM public.daily_activities
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
  
  -- If no record exists, create one
  IF activity_id IS NULL THEN
    INSERT INTO public.daily_activities (user_id, date)
    VALUES (p_user_id, CURRENT_DATE)
    RETURNING id INTO activity_id;
  END IF;
  
  RETURN activity_id;
END;
$$;

-- Create a function to update daily activity minutes
CREATE OR REPLACE FUNCTION public.update_daily_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_minutes INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure we have a record for today
  PERFORM public.get_or_create_daily_activity(p_user_id);
  
  -- Update the specific activity type
  IF p_activity_type = 'meditation' THEN
    UPDATE public.daily_activities
    SET meditation_minutes = meditation_minutes + p_minutes,
        updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  ELSIF p_activity_type = 'yoga' THEN
    UPDATE public.daily_activities
    SET yoga_minutes = yoga_minutes + p_minutes,
        updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  ELSIF p_activity_type = 'reading' THEN
    UPDATE public.daily_activities
    SET reading_minutes = reading_minutes + p_minutes,
        updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  END IF;
  
  -- Also update the total minutes in user_profiles
  IF p_activity_type = 'meditation' THEN
    UPDATE public.user_profiles
    SET meditation_minutes = meditation_minutes + p_minutes,
        updated_at = now()
    WHERE id = p_user_id;
  ELSIF p_activity_type = 'yoga' THEN
    UPDATE public.user_profiles
    SET yoga_minutes = yoga_minutes + p_minutes,
        updated_at = now()
    WHERE id = p_user_id;
  ELSIF p_activity_type = 'reading' THEN
    UPDATE public.user_profiles
    SET reading_minutes = reading_minutes + p_minutes,
        updated_at = now()
    WHERE id = p_user_id;
  END IF;
END;
$$;
