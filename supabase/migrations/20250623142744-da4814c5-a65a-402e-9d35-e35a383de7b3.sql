
-- Create nudges table
CREATE TABLE public.nudges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.nudges ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view nudges they sent or received
CREATE POLICY "Users can view their own nudges" 
  ON public.nudges 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Create policy that allows users to send nudges
CREATE POLICY "Users can send nudges" 
  ON public.nudges 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Add foreign key reference to nudges table in notifications
ALTER TABLE public.notifications 
ADD COLUMN nudge_id UUID REFERENCES public.nudges(id) ON DELETE CASCADE;

-- Update notifications type check to include nudge
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('like', 'comment', 'nudge'));

-- Create function to automatically create notifications for nudges
CREATE OR REPLACE FUNCTION create_nudge_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, post_id, nudge_id)
  VALUES (
    NEW.recipient_id,
    NEW.sender_id,
    'nudge',
    '00000000-0000-0000-0000-000000000000'::uuid, -- dummy post_id since nudges don't relate to posts
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for nudge notifications
CREATE TRIGGER trigger_nudge_notification
  AFTER INSERT ON nudges
  FOR EACH ROW
  EXECUTE FUNCTION create_nudge_notification();
