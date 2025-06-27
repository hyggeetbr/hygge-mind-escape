
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Playlist {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  track_count?: number;
}

export const useUserPlaylists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) {
        setPlaylists([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching playlists for user:', user.id);
        
        const { data, error } = await supabase
          .from('playlists')
          .select(`
            *,
            playlist_tracks(count)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching playlists:', error);
          setError(error.message);
        } else {
          console.log('Fetched playlists:', data);
          const playlistsWithCount = data?.map(playlist => ({
            ...playlist,
            track_count: playlist.playlist_tracks?.length || 0
          })) || [];
          setPlaylists(playlistsWithCount);
        }
      } catch (err) {
        console.error('Error in fetchPlaylists:', err);
        setError('Failed to fetch playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

  return { playlists, loading, error };
};
