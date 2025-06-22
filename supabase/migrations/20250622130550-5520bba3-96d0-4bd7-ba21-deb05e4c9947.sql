
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- recipient of the notification
  actor_id UUID NOT NULL, -- user who performed the action
  type TEXT NOT NULL CHECK (type IN ('like', 'comment')),
  post_id UUID NOT NULL,
  comment_id UUID NULL, -- only for comment notifications
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert notifications for others (when they like/comment)
CREATE POLICY "Users can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = actor_id);

-- Add foreign key references
ALTER TABLE public.notifications 
ADD CONSTRAINT fk_notifications_post 
FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;

ALTER TABLE public.notifications 
ADD CONSTRAINT fk_notifications_comment 
FOREIGN KEY (comment_id) REFERENCES public.post_comments(id) ON DELETE CASCADE;

-- Create function to automatically create notifications for likes
CREATE OR REPLACE FUNCTION create_like_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if the liker is not the post owner
  IF NEW.user_id != (SELECT user_id FROM community_posts WHERE id = NEW.post_id) THEN
    INSERT INTO notifications (user_id, actor_id, type, post_id)
    VALUES (
      (SELECT user_id FROM community_posts WHERE id = NEW.post_id),
      NEW.user_id,
      'like',
      NEW.post_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create notifications for comments
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if the commenter is not the post owner
  IF NEW.user_id != (SELECT user_id FROM community_posts WHERE id = NEW.post_id) THEN
    INSERT INTO notifications (user_id, actor_id, type, post_id, comment_id)
    VALUES (
      (SELECT user_id FROM community_posts WHERE id = NEW.post_id),
      NEW.user_id,
      'comment',
      NEW.post_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_like_notification
  AFTER INSERT ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION create_like_notification();

CREATE TRIGGER trigger_comment_notification
  AFTER INSERT ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION create_comment_notification();
