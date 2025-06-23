
-- Drop the existing foreign key constraint that's causing issues
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS fk_notifications_post;

-- Make post_id nullable (if not already done)
ALTER TABLE public.notifications 
ALTER COLUMN post_id DROP NOT NULL;

-- Create a new conditional foreign key constraint that only applies when post_id is not null
ALTER TABLE public.notifications 
ADD CONSTRAINT fk_notifications_post_conditional 
FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE
DEFERRABLE INITIALLY DEFERRED;

-- Update the nudge notification function to ensure it works properly
CREATE OR REPLACE FUNCTION create_nudge_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, post_id, nudge_id)
  VALUES (
    NEW.recipient_id,
    NEW.sender_id,
    'nudge',
    NULL, -- nudges don't relate to posts
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
