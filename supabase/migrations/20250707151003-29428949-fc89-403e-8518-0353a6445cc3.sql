
-- Create a database function to fetch pulse content
CREATE OR REPLACE FUNCTION public.get_pulse_content()
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  image_url TEXT,
  position INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pc.id,
    pc.title,
    pc.content,
    pc.image_url,
    pc.position,
    pc.is_active,
    pc.created_at,
    pc.updated_at
  FROM public.pulse_content pc
  WHERE pc.is_active = true
  ORDER BY pc.position ASC;
END;
$$;
