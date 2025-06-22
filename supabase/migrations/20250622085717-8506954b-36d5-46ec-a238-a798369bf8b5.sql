
-- Add username column to user_profiles table
ALTER TABLE public.user_profiles ADD COLUMN username TEXT;

-- Clear all existing community data for fresh start
DELETE FROM public.post_comments;
DELETE FROM public.post_likes;
DELETE FROM public.community_posts;
