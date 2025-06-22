import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from 'date-fns';
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PostDetail = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const loadPost = async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      // Fetch the specific post with user profile
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (postError) {
        console.error('Error loading post:', postError);
        setPost(null);
        setLoading(false);
        return;
      }

      if (!postData) {
        setPost(null);
        setLoading(false);
        return;
      }

      // Get user profile for the post
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('username, avatar_url')
        .eq('id', postData.user_id)
        .single();

      // Get likes count and user's like status
      const [likesResult, commentsResult, userLikeResult] = await Promise.all([
        supabase
          .from('post_likes')
          .select('id', { count: 'exact' })
          .eq('post_id', postId),
        supabase
          .from('post_comments')
          .select('id', { count: 'exact' })
          .eq('post_id', postId),
        user ? supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single() : Promise.resolve({ error: true })
      ]);

      const enrichedPost = {
        ...postData,
        user_profiles: { 
          full_name: profile?.username || 'User', 
          avatar_url: profile?.avatar_url || null 
        },
        likes_count: likesResult.count || 0,
        comments_count: commentsResult.count || 0,
        user_has_liked: !userLikeResult.error
      };

      setPost(enrichedPost);
      
      // Load comments
      await loadComments();
    } catch (error) {
      console.error('Error loading post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    if (!postId) return;

    try {
      const { data: comments, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading comments:', error);
        return;
      }

      if (!comments || comments.length === 0) {
        setComments([]);
        return;
      }

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
          };
        })
      );

      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadPost();
    }
  }, [postId, user]);

  const handleLike = async () => {
    if (!post || !user) return;

    try {
      if (post.user_has_liked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error unliking post:', error);
          return;
        }

        setPost(prev => ({
          ...prev,
          user_has_liked: false,
          likes_count: Math.max((prev.likes_count || 0) - 1, 0)
        }));
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert([
            {
              post_id: post.id,
              user_id: user.id
            }
          ]);

        if (error) {
          console.error('Error liking post:', error);
          return;
        }

        setPost(prev => ({
          ...prev,
          user_has_liked: true,
          likes_count: (prev.likes_count || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post || !user) return;
    
    setIsSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('post_comments')
        .insert([
          {
            post_id: post.id,
            user_id: user.id,
            content: newComment.trim()
          }
        ]);

      if (error) {
        console.error('Error adding comment:', error);
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setNewComment('');
      await loadComments();
      setPost(prev => ({
        ...prev,
        comments_count: prev.comments_count + 1
      }));

      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (!post) return;
    const shareText = `${post.title}\n\n${post.description}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: window.location.href,
      });
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' - Shared from Hygge Community')}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-black">
          <h2 className="text-2xl font-light mb-4">Please sign in to view posts</h2>
          <Button onClick={() => navigate("/")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4 text-black">Post not found</h2>
          <Button onClick={() => navigate("/community")}>Back to Community</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/community")}
          className="text-black hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-black text-xl font-medium">Post</h1>
        
        <div className="w-10"></div>
      </div>

      {/* Post Content */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {post.user_profiles?.avatar_url ? (
                  <img 
                    src={post.user_profiles.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(post.user_profiles?.full_name || 'User')
                )}
              </div>
              <div>
                <p className="font-semibold text-black">{post.user_profiles?.full_name || 'User'}</p>
                <p className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="p-4">
            <h3 className="text-black text-lg font-semibold mb-2">{post.title}</h3>
            <p className="text-gray-700 mb-4">{post.description}</p>
            
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt="Post" 
                className="w-full rounded-lg object-cover max-h-96"
              />
            )}
          </div>

          {/* Post Actions */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                    post.user_has_liked
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={16} className={post.user_has_liked ? 'fill-current' : ''} />
                  <span className="text-sm">{post.likes_count || 0}</span>
                </button>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle size={16} />
                  <span className="text-sm">{post.comments_count || 0}</span>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-black text-lg font-semibold mb-4">Comments</h3>
          
          {/* Add Comment */}
          <div className="mb-6">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3 bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmittingComment}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmittingComment ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {comment.user_profiles?.avatar_url ? (
                        <img 
                          src={comment.user_profiles.avatar_url} 
                          alt="Avatar" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(comment.user_profiles?.full_name || 'User')
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-black text-sm">
                          {comment.user_profiles?.full_name || 'User'}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
