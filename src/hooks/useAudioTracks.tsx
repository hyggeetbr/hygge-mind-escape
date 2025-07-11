
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AudioTrack {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string;
  category: string;
  subcategory: string | null;
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

export const useAudioTracks = (category?: string, subcategory?: string) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        console.log('Fetching audio tracks for category:', category, 'subcategory:', subcategory);
        
        let query = supabase
          .from('audio_tracks')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
          
          // If we have a subcategory, filter by it
          if (subcategory) {
            console.log('Filtering by subcategory:', subcategory);
            query = query.eq('subcategory', subcategory);
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching audio tracks:', error);
          setError(error.message);
        } else {
          console.log('Fetched audio tracks:', data);
          console.log('Track categories found:', data?.map(t => ({ title: t.title, category: t.category, subcategory: t.subcategory })));
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
  }, [category, subcategory]);

  const incrementPlayCount = async (trackId: string) => {
    try {
      console.log('Incrementing play count for track:', trackId);
      
      // Record the play
      const { error: playError } = await supabase
        .from('audio_plays')
        .insert({
          track_id: trackId,
          user_id: (await supabase.auth.getUser()).data.user?.id || null
        });

      if (playError) {
        console.error('Error recording play:', playError);
      }

      // Get current play count and increment it
      const { data: trackData, error: fetchError } = await supabase
        .from('audio_tracks')
        .select('play_count')
        .eq('id', trackId)
        .single();

      if (fetchError) {
        console.error('Error fetching track data:', fetchError);
        return;
      }

      if (trackData) {
        const { error: updateError } = await supabase
          .from('audio_tracks')
          .update({ play_count: trackData.play_count + 1 })
          .eq('id', trackId);

        if (updateError) {
          console.error('Error updating play count:', updateError);
          return;
        }

        // Update local state
        setTracks(prev => prev.map(track => 
          track.id === trackId 
            ? { ...track, play_count: track.play_count + 1 }
            : track
        ));

        console.log('Successfully incremented play count for track:', trackId);
      }
    } catch (error) {
      console.error('Error incrementing play count:', error);
    }
  };

  return { tracks, loading, error, incrementPlayCount };
};
