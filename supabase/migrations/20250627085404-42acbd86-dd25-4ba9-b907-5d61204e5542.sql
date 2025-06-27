
-- Create a table for user track likes
CREATE TABLE public.track_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID NOT NULL REFERENCES public.audio_tracks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.track_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for track_likes
CREATE POLICY "Users can view their own track likes" 
  ON public.track_likes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own track likes" 
  ON public.track_likes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own track likes" 
  ON public.track_likes 
  FOR DELETE 
  USING (auth.uid() = user_id);
