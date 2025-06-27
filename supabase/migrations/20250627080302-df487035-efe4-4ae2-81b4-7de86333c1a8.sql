
-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-files', 'audio-files', true);

-- Create storage policies for the audio-files bucket
CREATE POLICY "Anyone can view audio files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'audio-files');

CREATE POLICY "Authenticated users can upload audio files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'audio-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own audio files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'audio-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create audio_tracks table
CREATE TABLE public.audio_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('morning_affirmations', 'daily_wisdom', 'sleep_sounds')),
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  uploaded_by UUID,
  is_public BOOLEAN NOT NULL DEFAULT true,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create playlist_tracks junction table
CREATE TABLE public.playlist_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.audio_tracks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(playlist_id, track_id)
);

-- Create audio_plays table for tracking play history
CREATE TABLE public.audio_plays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID NOT NULL REFERENCES public.audio_tracks(id) ON DELETE CASCADE,
  user_id UUID,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_played_seconds INTEGER DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_plays ENABLE ROW LEVEL SECURITY;

-- RLS policies for audio_tracks
CREATE POLICY "Anyone can view public audio tracks" 
  ON public.audio_tracks 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Authenticated users can upload audio tracks" 
  ON public.audio_tracks 
  FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by OR uploaded_by IS NULL);

CREATE POLICY "Users can update their own audio tracks" 
  ON public.audio_tracks 
  FOR UPDATE 
  USING (auth.uid() = uploaded_by OR uploaded_by IS NULL);

CREATE POLICY "Users can delete their own audio tracks" 
  ON public.audio_tracks 
  FOR DELETE 
  USING (auth.uid() = uploaded_by OR uploaded_by IS NULL);

-- RLS policies for playlists
CREATE POLICY "Users can view public playlists and their own playlists" 
  ON public.playlists 
  FOR SELECT 
  USING (is_public = true OR auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own playlists" 
  ON public.playlists 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own playlists" 
  ON public.playlists 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own playlists" 
  ON public.playlists 
  FOR DELETE 
  USING (auth.uid()::text = user_id::text);

-- RLS policies for playlist_tracks
CREATE POLICY "Users can view playlist tracks for accessible playlists" 
  ON public.playlist_tracks 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.playlists p 
    WHERE p.id = playlist_id 
    AND (p.is_public = true OR p.user_id::text = auth.uid()::text)
  ));

CREATE POLICY "Users can manage tracks in their own playlists" 
  ON public.playlist_tracks 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.playlists p 
    WHERE p.id = playlist_id 
    AND p.user_id::text = auth.uid()::text
  ));

-- RLS policies for audio_plays
CREATE POLICY "Users can view all audio plays" 
  ON public.audio_plays 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create audio play records" 
  ON public.audio_plays 
  FOR INSERT 
  WITH CHECK (true);
