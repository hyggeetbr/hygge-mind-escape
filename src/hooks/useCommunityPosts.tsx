
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url?: string;
  created_at: string;
  user_profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  likes_count?: number;
  comments_count?: number;
  user_has_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

export const useCommunityPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    if (!user) return;

    try {
      // Load all posts with user profiles and counts
      const { data: posts, error } = await supabase
        .from('community_posts' as any)
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
        return;
      }

      // Get likes and comments counts for each post
      const postsWithCounts = await Promise.all(
        (posts || []).map(async (post: any) => {
          const [likesResult, commentsResult, userLikeResult] = await Promise.all([
            supabase
              .from('post_likes' as any)
              .select('id', { count: 'exact' })
              .eq('post_id', post.id),
            supabase
              .from('post_comments' as any)
              .select('id', { count: 'exact' })
              .eq('post_id', post.id),
            supabase
              .from('post_likes' as any)
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single()
          ]);

          return {
            ...post,
            likes_count: likesResult.count || 0,
            comments_count: commentsResult.count || 0,
            user_has_liked: !userLikeResult.error
          } as CommunityPost;
        })
      );

      setAllPosts(postsWithCounts);
      setUserPosts(postsWithCounts.filter(post => post.user_id === user.id));
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, description: string, imageFile?: File) => {
    if (!user) return false;

    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return false;
        }

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(uploadData.path);
        
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('community_posts' as any)
        .insert([
          {
            user_id: user.id,
            title,
            description,
            image_url: imageUrl
          }
        ]);

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Your post has been created!",
      });
      
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = allPosts.find(p => p.id === postId);
      if (!post) return;

      if (post.user_has_liked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes' as any)
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error unliking post:', error);
          return;
        }
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes' as any)
          .insert([
            {
              post_id: postId,
              user_id: user.id
            }
          ]);

        if (error) {
          console.error('Error liking post:', error);
          return;
        }
      }

      await loadPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('post_comments' as any)
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content
          }
        ]);

      if (error) {
        console.error('Error adding comment:', error);
        return false;
      }

      await loadPosts();
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const getPostComments = async (postId: string): Promise<PostComment[]> => {
    try {
      const { data, error } = await supabase
        .from('post_comments' as any)
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        return [];
      }

      return (data || []) as PostComment[];
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  return {
    allPosts,
    userPosts,
    loading,
    createPost,
    toggleLike,
    addComment,
    getPostComments,
    loadPosts
  };
};
