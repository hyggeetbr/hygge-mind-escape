
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioTrack {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string;
  category: 'morning_affirmations' | 'daily_wisdom' | 'sleep_sounds';
  duration_seconds: number | null;
  file_size_bytes: number | null;
  uploaded_by: string | null;
  is_public: boolean;
  play_count: number;
  artist: string | null;
  cover_art_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useAudioTracks = (category?: string) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        console.log('Fetching audio tracks for category:', category);
        
        let query = supabase
          .from('audio_tracks')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching audio tracks:', error);
          setError(error.message);
        } else {
          console.log('Fetched audio tracks:', data);
          // Type assertion to ensure the data matches our AudioTrack interface
          setTracks((data as AudioTrack[]) || []);
        }
      } catch (err) {
        console.error('Error in fetchTracks:', err);
        setError('Failed to fetch audio tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [category]);

  const incrementPlayCount = async (trackId: string) => {
    try {
      // Record the play
      await supabase
        .from('audio_plays')
        .insert({
          track_id: trackId,
          user_id: (await supabase.auth.getUser()).data.user?.id || null
        });

      // Get current play count and increment it
      const { data: trackData } = await supabase
        .from('audio_tracks')
        .select('play_count')
        .eq('id', trackId)
        .single();

      if (trackData) {
        await supabase
          .from('audio_tracks')
          .update({ play_count: trackData.play_count + 1 })
          .eq('id', trackId);

        // Update local state
        setTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { ...track, play_count: track.play_count + 1 }
            : track
        ));
      }
    } catch (error) {
      console.error('Error incrementing play count:', error);
    }
  };

  return { tracks, loading, error, incrementPlayCount };
};
