
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileData {
  id: string;
  username: string;
  avatar_url?: string;
  posts_count: number;
  total_likes: number;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    toggleLike,
    addComment,
    getPostComments,
    deletePost
  } = useCommunityPosts();

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const loadUserProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, username, avatar_url')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading user profile:', profileError);
        return;
      }

      // Get user posts with likes count
      const { data: posts, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error loading user posts:', postsError);
        return;
      }

      // Get posts with profiles and like/comment counts
      const postsWithDetails = await Promise.all(
        (posts || []).map(async (post: any) => {
          const [likesResult, commentsResult, userLikeResult] = await Promise.all([
            supabase
              .from('post_likes')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id),
            supabase
              .from('post_comments')
              .select('id', { count: 'exact' })
              .eq('post_id', post.id),
            user ? supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single() : Promise.resolve({ error: true })
          ]);

          return {
            ...post,
            user_profiles: { 
              full_name: profile?.username || 'User', 
              avatar_url: profile?.avatar_url || null 
            },
            likes_count: likesResult.count || 0,
            comments_count: commentsResult.count || 0,
            user_has_liked: user ? !userLikeResult.error : false
          };
        })
      );

      // Calculate total likes across all posts
      const totalLikes = postsWithDetails.reduce((sum, post) => sum + (post.likes_count || 0), 0);

      setProfileData({
        id: profile.id,
        username: profile.username || 'User',
        avatar_url: profile.avatar_url,
        posts_count: posts?.length || 0,
        total_likes: totalLikes
      });

      setUserPosts(postsWithDetails);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (post: any) => {
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

  useEffect(() => {
    loadUserProfile();
  }, [userId, user]);

  if (loading) {
    return (
      <div className="min-h-screen calm-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen calm-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-light mb-4">User not found</h2>
          <Button onClick={() => navigate("/community")}>Back to Community</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen calm-gradient relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-white/4 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/community")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-white text-xl font-medium">{profileData.username}</h1>
        
        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* Profile Section */}
      <div className="relative z-10 px-6 pb-6">
        <div className="bg-white rounded-lg p-6 mb-6 animate-fade-in">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {profileData.avatar_url ? (
                <img 
                  src={profileData.avatar_url} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(profileData.username)
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black mb-2">{profileData.username}</h2>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-around py-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{profileData.posts_count}</div>
              <div className="text-gray-600 text-sm">posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">{profileData.total_likes}</div>
              <div className="text-gray-600 text-sm">total likes</div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {userPosts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-black text-lg font-medium">No posts yet</p>
              <p className="text-gray-600 text-sm mt-2">This user hasn't shared anything with the community.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={toggleLike}
                  onComment={addComment}
                  onShare={handleShare}
                  onGetComments={getPostComments}
                  onDelete={user?.id === profileData.id ? deletePost : undefined}
                  isOwnPost={user?.id === profileData.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
