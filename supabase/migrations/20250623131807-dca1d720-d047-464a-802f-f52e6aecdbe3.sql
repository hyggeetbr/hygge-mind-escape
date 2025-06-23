
-- Add theme preference column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN theme_preference TEXT DEFAULT 'pattern1';

-- Update existing users to have default theme
UPDATE public.user_profiles 
SET theme_preference = 'pattern1' 
WHERE theme_preference IS NULL;
