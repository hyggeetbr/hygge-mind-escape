
-- First, let's add a tags/categories system to our articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS content TEXT;

-- Insert the Osho articles
INSERT INTO public.articles (title, content, author, category, summary, estimated_read_minutes, url) VALUES 
(
  'The Art of Living in the Present',
  'Life is available only in the present moment. If you are not here-now, you miss it. And life missed is never found again. It is irreplaceable, irretrievable.

Meditation is not concentration, it is relaxation. It is not focusing the mind on one object, but relaxation of the mind from all objects. In meditation you are not going somewhere else. You are simply being here. You have always been here. You cannot be anywhere else. You are existence.

The mind is always either in the past or in the future. It is never in the present. The present belongs to existence, not to the mind. When you are present, the mind disappears. When the mind is there, you are not present. They cannot coexist.

To be in the present is to be in meditation. And meditation is not something you do for a few minutes in the morning or evening. Meditation is a way of living. It is living moment to moment in awareness, in consciousness, in presence.

The beauty of existence is available only when you are present. The flowers are blooming, the birds are singing, the sun is shining, the wind is blowing - but you are missing it all because you are not here. You are somewhere else in your mind, in your thoughts, in your worries, in your plans.

Come back to the present. This is the only time that exists. The past is gone, the future is not yet here. What is real is this moment, this very moment. In this moment, all possibilities exist. In this moment, you can be transformed.',
  'Osho',
  'Osho',
  'A profound exploration of living in the present moment and understanding the nature of meditation as a way of being.',
  6,
  '#'
),
(
  'Understanding the Mind',
  'The mind is not your enemy, but it is not your friend either. The mind is simply a mechanism, a bio-computer that has been programmed by society, by education, by conditioning. It has its utility, but it should not be the master of your life.

Watch your thoughts as you would watch clouds passing in the sky. They come and go. You are not the thoughts; you are the watcher of the thoughts. You are the sky, not the clouds. The clouds change, but the sky remains the same.

When you identify with your thoughts, you become a slave to your mind. When you become the witness of your thoughts, you become the master. The witness is your true nature. It is pure consciousness, aware and awake.

Do not fight with the mind. Fighting with the mind only gives it more energy. Simply watch, observe, be aware. In your watching, the mind begins to slow down. In your witnessing, thoughts begin to have gaps. In these gaps, you will find your true self.

The mind is like a monkey, jumping from branch to branch, from thought to thought. Do not try to catch the monkey; just stop feeding it. When you stop paying attention to every thought, when you stop taking thoughts seriously, the monkey mind begins to settle down.

Meditation is not about stopping thoughts. Meditation is about not being disturbed by thoughts. Let them come and go like traffic on the road. You are sitting in your house, and the traffic is passing by. You hear the sound, but you are not disturbed. You are not running after every car.',
  'Osho',
  'Osho',
  'Insights into the nature of mind and how to develop a witnessing consciousness that transcends mental conditioning.',
  5,
  '#'
);
