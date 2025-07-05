
-- Add subcategory column to audio_tracks table if it doesn't exist
ALTER TABLE audio_tracks ADD COLUMN IF NOT EXISTS subcategory VARCHAR(50);

-- Update existing daily_wisdom tracks to have proper subcategories
-- Reset all daily_wisdom tracks to have clean category names
UPDATE audio_tracks 
SET category = 'daily_wisdom', 
    subcategory = 'ancient_teachings'
WHERE category LIKE 'daily_wisdom%';

-- Create index for better performance on category/subcategory queries
CREATE INDEX IF NOT EXISTS idx_audio_tracks_category_subcategory 
ON audio_tracks(category, subcategory);
