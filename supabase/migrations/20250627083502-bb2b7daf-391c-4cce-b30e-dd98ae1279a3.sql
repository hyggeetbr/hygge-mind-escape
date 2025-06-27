
-- Add artist and cover_art_url columns to the audio_tracks table
ALTER TABLE public.audio_tracks 
ADD COLUMN artist TEXT,
ADD COLUMN cover_art_url TEXT;
