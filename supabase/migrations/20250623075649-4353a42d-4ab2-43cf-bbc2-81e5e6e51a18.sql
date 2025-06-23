
-- Add tracking columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN meditation_minutes INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN yoga_minutes INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN reading_minutes INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN achievements_count INTEGER DEFAULT 0 NOT NULL;

-- Update existing users to have these values set to 0
UPDATE public.user_profiles 
SET meditation_minutes = 0,
    yoga_minutes = 0,
    reading_minutes = 0,
    achievements_count = 0
WHERE meditation_minutes IS NULL 
   OR yoga_minutes IS NULL 
   OR reading_minutes IS NULL 
   OR achievements_count IS NULL;
