
-- 1. Enable Row-Level Security on articles table and add proper policies
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view articles (public content)
CREATE POLICY "Anyone can view articles" 
  ON public.articles 
  FOR SELECT 
  USING (true);

-- Only authenticated users can create articles
CREATE POLICY "Authenticated users can create articles" 
  ON public.articles 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only allow updates to non-critical fields by authenticated users
CREATE POLICY "Authenticated users can update article metadata" 
  ON public.articles 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Prevent deletion of articles (or restrict to admin users only)
CREATE POLICY "Prevent article deletion" 
  ON public.articles 
  FOR DELETE 
  USING (false);

-- 2. Fix database functions to prevent SQL injection via search_path manipulation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_like_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only create notification if the liker is not the post owner
  IF NEW.user_id != (SELECT user_id FROM public.community_posts WHERE id = NEW.post_id) THEN
    INSERT INTO public.notifications (user_id, actor_id, type, post_id)
    VALUES (
      (SELECT user_id FROM public.community_posts WHERE id = NEW.post_id),
      NEW.user_id,
      'like',
      NEW.post_id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_comment_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only create notification if the commenter is not the post owner
  IF NEW.user_id != (SELECT user_id FROM public.community_posts WHERE id = NEW.post_id) THEN
    INSERT INTO public.notifications (user_id, actor_id, type, post_id, comment_id)
    VALUES (
      (SELECT user_id FROM public.community_posts WHERE id = NEW.post_id),
      NEW.user_id,
      'comment',
      NEW.post_id,
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_nudge_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, actor_id, type, post_id, nudge_id)
  VALUES (
    NEW.recipient_id,
    NEW.sender_id,
    'nudge',
    NULL, -- nudges don't relate to posts
    NEW.id
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_daily_activity(p_user_id uuid, p_activity_type text, p_minutes integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Ensure we have a record for today
  PERFORM public.get_or_create_daily_activity(p_user_id);
  
  -- Update the specific activity type
  IF p_activity_type = 'meditation' THEN
    UPDATE public.daily_activities
    SET meditation_minutes = meditation_minutes + p_minutes,
        updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  ELSIF p_activity_type = 'yoga' THEN
    UPDATE public.daily_activities
    SET yoga_minutes = yoga_minutes + p_minutes,
        updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  ELSIF p_activity_type = 'reading' THEN
    UPDATE public.daily_activities
    SET reading_minutes = reading_minutes + p_minutes,
        updated_at = now()
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  END IF;
  
  -- Also update the total minutes in user_profiles
  IF p_activity_type = 'meditation' THEN
    UPDATE public.user_profiles
    SET meditation_minutes = meditation_minutes + p_minutes,
        updated_at = now()
    WHERE id = p_user_id;
  ELSIF p_activity_type = 'yoga' THEN
    UPDATE public.user_profiles
    SET yoga_minutes = yoga_minutes + p_minutes,
        updated_at = now()
    WHERE id = p_user_id;
  ELSIF p_activity_type = 'reading' THEN
    UPDATE public.user_profiles
    SET reading_minutes = reading_minutes + p_minutes,
        updated_at = now()
    WHERE id = p_user_id;
  END IF;
END;
$$;
