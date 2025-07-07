
-- Create a table for pulse content
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

-- Enable Row Level Security
ALTER TABLE public.pulse_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to view pulse content (public content)
CREATE POLICY "Anyone can view pulse content" 
  ON public.pulse_content 
  FOR SELECT 
  USING (is_active = true);

-- Insert the 10 pulse content items
INSERT INTO public.pulse_content (title, content, position) VALUES
('The Pause is Power', 'Every breath pauses before turning. Life offers the same—a moment before action, a space before reaction. Most rush past it. But in that pause lives your freedom. When you slow down, the choice returns to you. Try it: next time you're triggered, pause. That moment is yours. And within it is all your strength.', 1),
('You Are Not Your Thoughts', 'Your thoughts are just weather. Temporary. Passing. Some are loud storms, others soft winds. But you—you''re the sky. Still. Unmoved. Eternal. Meditation isn''t about stopping thoughts; it''s about seeing them clearly. Step back. Watch them come and go. You''ll see: the one who watches is deeper than anything that can be thought.', 2),
('Socrates Wasn''t Kidding', '"Know thyself" isn''t an idea—it''s a path. You''re a mystery even to yourself. Beneath your patterns, your roles, your names—there''s something untouched. Start small: notice how you respond to discomfort. Ask why. Then go deeper. To know yourself is to become free from yourself. The person watching is already wiser than the one performing.', 3),
('Desire is a Treadmill', 'You chase. You achieve. Then you want again. Desire has no finish line. It whispers, "Just this one more thing…" but never stops. What if, just for today, you paused the chase? Sat still? Listened to the silence beneath wanting? That''s contentment. And it doesn''t come after desire—it comes without it.', 4),
('Return to the Breath', 'Wherever you are, the breath is there. It''s your anchor. Your reset. Your witness. Inhale, and the world slows. Exhale, and the noise fades. Try this now: feel one breath completely. From start to stillness. The breath asks for nothing. Demands nothing. But gives everything—presence, space, and the memory of who you were before thinking began.', 5),
('The Mind Hates the Present', 'The mind is a time traveler. It loves the past. It clings to futures. But the now? It resists it. Why? Because in the now, the mind becomes useless. There''s nothing to fix, no image to uphold. Just this moment. If you sit with it, you''ll feel it: beneath thought, there''s no problem. Just peace.', 6),
('This Moment Won''t Return', 'This second—the light, the scent in the air, the weight in your chest—it will never happen again. All of it is vanishing even as you read. That''s not tragic. That''s sacred. To see impermanence is to see value. Pay attention. Because this, right now, is all that''s ever real.', 7),
('Peace Isn''t a Place', 'We keep waiting for peace. When I finish this. When I fix that. But peace isn''t a destination. It''s not in a job, a relationship, a future. It''s in the space between two breaths. It''s in letting go of control. It''s now, or never. Every moment is offering it—you just have to stop chasing and start seeing.', 8),
('Everything is Borrowed', 'Your body. Your breath. The sunrise. The touch of someone who loves you. All borrowed. All temporary. But not meaningless. That''s what makes them sacred. To own something is to forget it. But to know it''s passing? That brings gratitude. Live like you''re just visiting. Because you are.', 9),
('The Light You Seek is Within', 'Every seeker eventually hits a wall. More books don''t help. More advice falls flat. That''s when the turn happens. Inward. Toward the still place inside. It''s always been there—behind every breath, beneath every silence. The same light you''ve been chasing lives in the one who''s chasing. You don''t find it. You remember it.', 10);
