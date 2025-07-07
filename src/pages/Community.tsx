import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Home, Users, Bot, Music, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { PostCard } from "@/components/PostCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import CommunityLeaderboard from "@/components/CommunityLeaderboard";
import { useAuth } from "@/hooks/useAuth";

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  
  const {
    toggleLike,
    addComment,
    getPostComments,
    createPost,
    deletePost
  } = useCommunityPosts();

  const loadCommunityPosts = async () => {
    setLoading(true);
    try {
      const posts = await useCommunityPosts().getCommunityPosts();
      setPosts(posts || []);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: any) => {
    setPosts([newPost, ...posts]);
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
    loadCommunityPosts();
  }, []);

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
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Community</h1>
        <Button 
          variant="ghost"
          onClick={() => setLeaderboardOpen(true)}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Users size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Create Post Button */}
        <div className="mb-6 animate-fade-in">
          <Button 
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30"
            onClick={() => setShowCreatePost(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create a Post
          </Button>
        </div>

        {/* Posts */}
        <div className="space-y-6 animate-fade-in">
          {loading ? (
            <div className="text-center text-white/60 py-8">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <p>No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onComment={addComment}
                onShare={handleShare}
                onGetComments={getPostComments}
                onDelete={user?.id === post.user_id ? deletePost : undefined}
                isOwnPost={user?.id === post.user_id}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Home className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Music className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/pulse")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Pulse</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-black" />
            </div>
            <span className="text-white text-xs font-medium">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Lumina</span>
          </div>
        </div>
      </div>

      <CreatePostDialog
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
       <CommunityLeaderboard isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
    </div>
  );
};

export default Community;
