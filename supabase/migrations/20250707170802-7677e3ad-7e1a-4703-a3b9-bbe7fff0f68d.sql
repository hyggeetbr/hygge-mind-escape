
-- Create the pulse_content table
CREATE TABLE public.pulse_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.pulse_content ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view active pulse content
CREATE POLICY "Anyone can view active pulse content" 
  ON public.pulse_content 
  FOR SELECT 
  USING (is_active = true);

-- Add some sample data
INSERT INTO public.pulse_content (title, content, position, is_active) VALUES
('Welcome to Pulse', 'Discover amazing content curated just for you. Swipe up to explore more stories and insights.', 1, true),
('Daily Inspiration', 'Every day brings new opportunities to grow, learn, and make a positive impact on the world around you.', 2, true),
('Mindful Moments', 'Take a deep breath and embrace this moment. Mindfulness helps us stay present and find peace in our daily lives.', 3, true);
