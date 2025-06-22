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
  const [userProfile, setUserProfile] = useState<any>(null);

  const checkUserProfile = async () => {
    if (!user) {
      console.log('No user found, returning null');
      return null;
    }

    console.log('Checking user profile for user:', user.id);

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No profile found for user, will need to create one');
          setUserProfile(null);
          return null;
        } else {
          console.error('Error fetching profile:', error);
          return null;
        }
      }

      console.log('Profile found:', profile);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Exception while checking user profile:', error);
      return null;
    }
  };

  const loadPosts = async () => {
    if (!user) {
      console.log('No user, skipping post load');
      return;
    }

    console.log('Loading posts for user:', user.id);
    setLoading(true);

    try {
      // Load all posts
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
        return;
      }

      console.log('Raw posts loaded:', posts);

      // Get user profiles for all posts
      const postsWithProfiles = await Promise.all(
        (posts || []).map(async (post: any) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username, avatar_url')
            .eq('id', post.user_id)
            .single();

          const [likesResult, commentsResult, userLikeResult] = await Promise.all([
            supabase
              .from('post_likes')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id),
            supabase
              .from('post_comments')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id),
            supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single()
          ]);

          return {
            ...post,
            user_profiles: { 
              full_name: profile?.username || 'User', 
              avatar_url: profile?.avatar_url || null 
            },
            likes_count: likesResult.count || 0,
            comments_count: commentsResult.count || 0,
            user_has_liked: !userLikeResult.error
          } as CommunityPost;
        })
      );

      console.log('Posts with profiles:', postsWithProfiles);
      setAllPosts(postsWithProfiles);
      setUserPosts(postsWithProfiles.filter(post => post.user_id === user.id));
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, description: string, imageFile?: File) => {
    if (!user) {
      console.log('No user, cannot create post');
      return false;
    }

    console.log('Creating post:', { title, description, hasImage: !!imageFile });

    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        console.log('Uploading image:', fileName);
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
        console.log('Image uploaded successfully:', imageUrl);
      }

      console.log('Inserting post into database...');
      const { data: newPost, error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            image_url: imageUrl
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating post:', error);
        toast({
          title: "Error",
          description: "Failed to create post. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Post created successfully:', newPost);
      toast({
        title: "Success",
        description: "Your post has been created!",
      });
      
      // Reload posts to get the new one
      await loadPosts();
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = allPosts.find(p => p.id === postId);
      if (!post) return;

      // Optimistically update the UI
      const updatedPosts = allPosts.map(p => {
        if (p.id === postId) {
          const newLiked = !p.user_has_liked;
          return {
            ...p,
            user_has_liked: newLiked,
            likes_count: newLiked ? (p.likes_count || 0) + 1 : Math.max((p.likes_count || 0) - 1, 0)
          };
        }
        return p;
      });
      
      setAllPosts(updatedPosts);
      setUserPosts(updatedPosts.filter(p => p.user_id === user.id));

      if (post.user_has_liked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error unliking post:', error);
          // Revert optimistic update on error
          await loadPosts();
          return;
        }
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert([
            {
              post_id: postId,
              user_id: user.id
            }
          ]);

        if (error) {
          console.error('Error liking post:', error);
          // Revert optimistic update on error
          await loadPosts();
          return;
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      await loadPosts();
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('post_comments')
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
      // First get the comments
      const { data: comments, error: commentsError } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error loading comments:', commentsError);
        return [];
      }

      if (!comments || comments.length === 0) {
        return [];
      }

      // Then get user profiles for each comment
      const commentsWithProfiles = await Promise.all(
        comments.map(async (comment: any) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username, avatar_url')
            .eq('id', comment.user_id)
            .single();

          return {
            ...comment,
            user_profiles: { 
              full_name: profile?.username || 'User', 
              avatar_url: profile?.avatar_url || null 
            }
          } as PostComment;
        })
      );

      return commentsWithProfiles;
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User changed, loading posts...');
      loadPosts();
      checkUserProfile();
    } else {
      setAllPosts([]);
      setUserPosts([]);
      setUserProfile(null);
      setLoading(false);
    }
  }, [user]);

  return {
    allPosts,
    userPosts,
    loading,
    userProfile,
    createPost,
    toggleLike,
    addComment,
    getPostComments,
    loadPosts,
    checkUserProfile
  };
};
