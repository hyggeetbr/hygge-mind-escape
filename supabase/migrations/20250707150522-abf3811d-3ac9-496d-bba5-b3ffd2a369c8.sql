
-- Add the pulse_content table to the database types
ALTER TABLE public.pulse_content REPLICA IDENTITY FULL;

-- Add the table to the realtime publication so it can be accessed
ALTER PUBLICATION supabase_realtime ADD TABLE public.pulse_content;
