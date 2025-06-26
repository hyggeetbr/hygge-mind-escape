
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface ArticleStats {
  likes: number;
  comments: number;
  saves: number;
  reads: number;
  isLiked: boolean;
  isSaved: boolean;
}

export const useArticleInteractions = (articleId: string) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ArticleStats>({
    likes: 0,
    comments: 0,
    saves: 0,
    reads: 0,
    isLiked: false,
    isSaved: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      // Get likes count
      const { count: likesCount } = await supabase
        .from('article_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);

      // Get comments count
      const { count: commentsCount } = await supabase
        .from('article_comments')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);

      // Get saves count
      const { count: savesCount } = await supabase
        .from('article_saves')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);

      // Get reads count
      const { count: readsCount } = await supabase
        .from('article_reads')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);

      let isLiked = false;
      let isSaved = false;

      if (user) {
        // Check if user has liked this article
        const { data: likeData } = await supabase
          .from('article_likes')
          .select('id')
          .eq('article_id', articleId)
          .eq('user_id', user.id)
          .single();

        isLiked = !!likeData;

        // Check if user has saved this article
        const { data: saveData } = await supabase
          .from('article_saves')
          .select('id')
          .eq('article_id', articleId)
          .eq('user_id', user.id)
          .single();

        isSaved = !!saveData;
      }

      setStats({
        likes: likesCount || 0,
        comments: commentsCount || 0,
        saves: savesCount || 0,
        reads: readsCount || 0,
        isLiked,
        isSaved,
      });
    } catch (error) {
      console.error('Error fetching article stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [articleId, user]);

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like articles.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (stats.isLiked) {
        // Remove like
        await supabase
          .from('article_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        setStats(prev => ({
          ...prev,
          likes: prev.likes - 1,
          isLiked: false,
        }));
      } else {
        // Add like
        await supabase
          .from('article_likes')
          .insert({
            article_id: articleId,
            user_id: user.id,
          });

        setStats(prev => ({
          ...prev,
          likes: prev.likes + 1,
          isLiked: true,
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save articles.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (stats.isSaved) {
        // Remove save
        await supabase
          .from('article_saves')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        setStats(prev => ({
          ...prev,
          saves: prev.saves - 1,
          isSaved: false,
        }));
      } else {
        // Add save
        await supabase
          .from('article_saves')
          .insert({
            article_id: articleId,
            user_id: user.id,
          });

        setStats(prev => ({
          ...prev,
          saves: prev.saves + 1,
          isSaved: true,
        }));
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: "Error",
        description: "Failed to update save status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRead = async () => {
    if (!user) return;

    try {
      await supabase
        .from('article_reads')
        .insert({
          article_id: articleId,
          user_id: user.id,
        });

      setStats(prev => ({
        ...prev,
        reads: prev.reads + 1,
      }));
    } catch (error) {
      console.error('Error adding read:', error);
    }
  };

  const addComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment.",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase
        .from('article_comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          content,
        });

      setStats(prev => ({
        ...prev,
        comments: prev.comments + 1,
      }));

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    }
  };

  return {
    stats,
    loading,
    toggleLike,
    toggleSave,
    addRead,
    addComment,
    refreshStats: fetchStats,
  };
};
