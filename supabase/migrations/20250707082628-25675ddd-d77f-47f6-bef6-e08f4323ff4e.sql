
-- Create a table for video tracks
CREATE TABLE public.video_tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('meditation', 'yoga', 'other')),
  subcategory TEXT,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  thumbnail_url TEXT,
  uploaded_by UUID,
  is_public BOOLEAN NOT NULL DEFAULT true,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_views table for tracking view history
CREATE TABLE public.video_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.video_tracks(id) ON DELETE CASCADE,
  user_id UUID,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_watched_seconds INTEGER DEFAULT 0
);

-- Enable RLS on video tables
ALTER TABLE public.video_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

-- RLS policies for video_tracks
CREATE POLICY "Anyone can view public video tracks" 
  ON public.video_tracks 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Authenticated users can upload video tracks" 
  ON public.video_tracks 
  FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by OR uploaded_by IS NULL);

CREATE POLICY "Users can update their own video tracks" 
  ON public.video_tracks 
  FOR UPDATE 
  USING (auth.uid() = uploaded_by OR uploaded_by IS NULL);

CREATE POLICY "Users can delete their own video tracks" 
  ON public.video_tracks 
  FOR DELETE 
  USING (auth.uid() = uploaded_by OR uploaded_by IS NULL);

-- RLS policies for video_views
CREATE POLICY "Users can view all video views" 
  ON public.video_views 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create video view records" 
  ON public.video_views 
  FOR INSERT 
  WITH CHECK (true);

-- Update storage bucket policies for video-files
CREATE POLICY "Anyone can view video files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'video-files');

CREATE POLICY "Authenticated users can upload video files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'video-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own video files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'video-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own video files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'video-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Make video-files bucket public
UPDATE storage.buckets SET public = true WHERE id = 'video-files';
