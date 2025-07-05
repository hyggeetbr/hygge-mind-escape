
-- Add new sub-categories to the audio_tracks table by updating the category column to support subcategories
-- We'll use a format like 'daily_wisdom_ancient_teachings' to maintain the structure

-- First, let's see what existing daily_wisdom tracks we have and update them to ancient_teachings
UPDATE audio_tracks 
SET category = 'daily_wisdom_ancient_teachings'
WHERE category = 'daily_wisdom' 
AND (title ILIKE '%osho%' OR artist ILIKE '%osho%' OR description ILIKE '%osho%');

-- Update the category column to allow longer strings for subcategories
ALTER TABLE audio_tracks ALTER COLUMN category TYPE VARCHAR(100);

-- Add a subcategory column to better organize the data
ALTER TABLE audio_tracks ADD COLUMN subcategory VARCHAR(50);

-- Update existing records to set subcategory
UPDATE audio_tracks 
SET subcategory = 'ancient_teachings'
WHERE category = 'daily_wisdom_ancient_teachings';

-- Set subcategory for other daily_wisdom tracks (if any remain)
UPDATE audio_tracks 
SET subcategory = 'general'
WHERE category = 'daily_wisdom' AND subcategory IS NULL;
