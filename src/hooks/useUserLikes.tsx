
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AudioTrack } from './useAudioTracks';

export const useUserLikes = () => {
  const { user } = useAuth();
  const [likedTracks, setLikedTracks] = useState<AudioTrack[]>([]);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedTracks = async () => {
    if (!user) {
      setLikedTracks([]);
      setLikedTrackIds(new Set());
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching liked tracks for user:', user.id);
      
      const { data, error } = await supabase
        .from('track_likes')
        .select(`
          track_id,
          audio_tracks (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching liked tracks:', error);
        setError(error.message);
      } else {
        console.log('Fetched liked tracks:', data);
        const tracks = data?.map(like => like.audio_tracks).filter(Boolean) as AudioTrack[] || [];
        const trackIds = new Set(data?.map(like => like.track_id) || []);
        setLikedTracks(tracks);
        setLikedTrackIds(trackIds);
      }
    } catch (err) {
      console.error('Error in fetchLikedTracks:', err);
      setError('Failed to fetch liked tracks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedTracks();
  }, [user]);

  const toggleLike = async (trackId: string) => {
    if (!user) return;

    try {
      const isLiked = likedTrackIds.has(trackId);
      
      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from('track_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('track_id', trackId);

        if (error) {
          console.error('Error removing like:', error);
          return;
        }

        // Update local state
        setLikedTrackIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(trackId);
          return newSet;
        });
        setLikedTracks(prev => prev.filter(track => track.id !== trackId));
      } else {
        // Add like
        const { error } = await supabase
          .from('track_likes')
          .insert({
            user_id: user.id,
            track_id: trackId
          });

        if (error) {
          console.error('Error adding like:', error);
          return;
        }

        // Update local state
        setLikedTrackIds(prev => new Set([...prev, trackId]));
        
        // Fetch the track details and add to liked tracks
        const { data: trackData } = await supabase
          .from('audio_tracks')
          .select('*')
          .eq('id', trackId)
          .single();

        if (trackData) {
          setLikedTracks(prev => [...prev, trackData as AudioTrack]);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const isTrackLiked = (trackId: string) => {
    return likedTrackIds.has(trackId);
  };

  return { 
    likedTracks, 
    loading, 
    error, 
    toggleLike, 
    isTrackLiked 
  };
};
