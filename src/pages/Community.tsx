
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Volume2, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useNotifications } from "@/hooks/useNotifications";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PostCard } from "@/components/PostCard";
import { UsernameDialog } from "@/components/UsernameDialog";
import { CommunityLeaderboard } from "@/components/CommunityLeaderboard";
import { FamilyMembersView } from "@/components/FamilyMembersView";
import { useAuth } from "@/hooks/useAuth";

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'community' | 'yours' | 'leaderboard' | 'family'>('community');
  
  const {
    allPosts,
    userPosts,
    loading,
    userProfile,
    createPost,
    toggleLike,
    addComment,
    getPostComments,
    checkUserProfile,
    deletePost
  } = useCommunityPosts();

  const { unreadCount } = useNotifications();

  const handleCreatePost = async (title: string, description: string, image?: File) => {
    console.log('Community handleCreatePost called with:', { title, description, hasImage: !!image });
    const success = await createPost(title, description, image);
    console.log('Create post success:', success);
    return success;
  };

  const handleUsernameSet = (username: string) => {
    console.log('Username set:', username);
    setShowUsernameDialog(false);
    // Reload posts to update the username display
    window.location.reload();
  };

  const handleUsernameChange = () => {
    console.log('Opening username change dialog');
    setShowUsernameDialog(true);
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

  console.log('Community render - Posts:', { 
    allPosts: allPosts.length, 
    userPosts: userPosts.length, 
    communityPosts: communityPosts.length,
    activeTab,
    userProfile
  });

  // Show loading if we're still waiting for user profile to load
  if (userProfile === undefined && loading) {
    return (
      <div className="min-h-screen calm-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading community...</p>
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
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <h1 className="text-white text-xl font-medium">Community</h1>
        
        <div className="flex items-center space-x-2">
          {/* Notifications bell */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/notifications")}
            className="text-white/80 hover:bg-white/10 hover:text-white relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            )}
          </Button>
          
          {/* Profile button - always visible */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUsernameChange}
            className="text-white/80 hover:bg-white/10 hover:text-white w-8 h-8 rounded-full bg-white/20"
          >
            <User size={16} />
          </Button>
          
          {/* Show create post button only when not on Family tab */}
          {activeTab !== 'family' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCreatePost(true)}
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Plus size={20} />
            </Button>
          )}
        </div>
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
              className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'community'
                  ? 'bg-white text-purple-700 font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Community Wall
            </button>
            <button
              onClick={() => setActiveTab('yours')}
              className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'yours'
                  ? 'bg-white text-purple-700 font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Your Posts
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'leaderboard'
                  ? 'bg-white text-purple-700 font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === 'family'
                  ? 'bg-white text-purple-700 font-semibold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Family
            </button>
          </div>
        </div>

        {/* Posts Content */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {activeTab === 'family' ? (
            <FamilyMembersView />
          ) : activeTab === 'leaderboard' ? (
            <CommunityLeaderboard />
          ) : loading ? (
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
                      <div className="bg-white rounded-lg p-8 border border-gray-200">
                        <p className="text-black text-lg font-medium">
                          There are no posts from any community members yet.
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
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
                          isOwnPost={false}
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
                      <div className="bg-white rounded-lg p-8 border border-gray-200">
                        <p className="text-black text-lg font-medium">
                          You haven't posted anything yet.
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                          Share your mindfulness journey with the community!
                        </p>
                        <Button 
                          onClick={() => setShowCreatePost(true)}
                          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
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
                          onDelete={deletePost}
                          isOwnPost={true}
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

      {/* Username Dialog */}
      <UsernameDialog
        open={showUsernameDialog}
        onClose={() => setShowUsernameDialog(false)}
        onUsernameSet={handleUsernameSet}
        isFirstTime={false}
        currentUsername={userProfile?.username || ''}
      />

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
      />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
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
            onClick={() => navigate("/sounds")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Sounds</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
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
                className="text-purple-600"
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
            onClick={() => navigate("/premium")}
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
