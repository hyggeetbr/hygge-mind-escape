
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/hooks/useAuth";

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState<'community' | 'yours'>('community');
  
  const {
    allPosts,
    userPosts,
    loading,
    createPost,
    toggleLike,
    addComment,
    getPostComments
  } = useCommunityPosts();

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

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSounds = () => {
    navigate("/sounds");
  };

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handlePremium = () => {
    navigate("/premium");
  };

  if (!user) {
    return (
      <div className="min-h-screen calm-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-light mb-4">Please sign in to view the community</h2>
          <Button onClick={() => navigate("/")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const communityPosts = allPosts.filter(post => post.user_id !== user.id);

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
          size="icon"
          onClick={() => setShowCreatePost(true)}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Plus size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-white text-3xl font-light mb-4">Connect & Inspire</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Share your journey and be inspired by our mindful community.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-lg p-1">
            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'community'
                  ? 'bg-white text-calm-purple'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Community Wall
            </button>
            <button
              onClick={() => setActiveTab('yours')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'yours'
                  ? 'bg-white text-calm-purple'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Your Posts
            </button>
          </div>
        </div>

        {/* Posts Content */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {loading ? (
            <div className="text-center text-white py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading posts...</p>
            </div>
          ) : (
            <>
              {activeTab === 'community' && (
                <div>
                  {communityPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="calm-card p-8">
                        <p className="text-gray-600 text-lg">
                          There are no posts from any community members yet.
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Be the first to share something inspiring!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {communityPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onLike={toggleLike}
                          onComment={addComment}
                          onShare={handleShare}
                          onGetComments={getPostComments}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'yours' && (
                <div>
                  {userPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="calm-card p-8">
                        <p className="text-gray-600 text-lg">
                          You haven't posted anything yet.
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                          Share your mindfulness journey with the community!
                        </p>
                        <Button 
                          onClick={() => setShowCreatePost(true)}
                          className="mt-4 bg-calm-purple hover:bg-calm-purple/90"
                        >
                          Create Your First Post
                        </Button>
                      </div>
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
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={createPost}
      />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDashboard}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleSounds}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Sounds</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDiscover}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">🔍</div>
            <span className="text-white/60 text-xs">Discover</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-calm-purple"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3"/>
                <path d="m16 18 3 3"/>
              </svg>
            </div>
            <span className="text-white text-xs font-medium">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="M12 8V4M4 8H20M6.9 15H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2M17 15h1.9a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2M15 8a3 3 0 1 0-6 0"/>
              </svg>
            </div>
            <span className="text-white/60 text-xs">Lumina</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handlePremium}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">⭐</div>
            <span className="text-white/60 text-xs">Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
