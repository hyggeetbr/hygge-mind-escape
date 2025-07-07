
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VideoTrack {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string;
  category: string;
  subcategory: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export const useVideoTracks = (category?: string, subcategory?: string) => {
  const [tracks, setTracks] = useState<VideoTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('video_tracks')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }
      
      if (subcategory) {
        query = query.eq('subcategory', subcategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching video tracks:', error);
        setError(error.message);
        return;
      }

      setTracks(data || []);
    } catch (err) {
      console.error('Error in fetchTracks:', err);
      setError('Failed to fetch video tracks');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (videoId: string) => {
    try {
      // Update view count
      await supabase
        .from('video_tracks')
        .update({ view_count: tracks.find(t => t.id === videoId)?.view_count + 1 || 1 })
        .eq('id', videoId);

      // Record view
      await supabase
        .from('video_views')
        .insert({
          video_id: videoId,
          user_id: null, // Can be updated to use auth.uid() when user is logged in
          duration_watched_seconds: 0
        });

      // Update local state
      setTracks(prev => prev.map(track => 
        track.id === videoId 
          ? { ...track, view_count: track.view_count + 1 }
          : track
      ));
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [category, subcategory]);

  return {
    tracks,
    loading,
    error,
    refetch: fetchTracks,
    incrementViewCount
  };
};
