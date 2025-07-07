
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Home, Users, Bot, Music, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { PostCard } from "@/components/PostCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { CommunityLeaderboard } from "@/components/CommunityLeaderboard";
import { FamilyMembersView } from "@/components/FamilyMembersView";
import { useAuth } from "@/hooks/useAuth";

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    allPosts,
    userPosts,
    toggleLike,
    addComment,
    getPostComments,
    createPost,
    deletePost,
    loadPosts
  } = useCommunityPosts();

  const loadCommunityPosts = async () => {
    setLoading(true);
    try {
      await loadPosts();
      setPosts(allPosts || []);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = async (title: string, description: string, imageFile?: File) => {
    const success = await createPost(title, description, imageFile);
    if (success) {
      await loadCommunityPosts();
    }
    return success;
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

  useEffect(() => {
    setPosts(allPosts);
  }, [allPosts]);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
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
          className="text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-gray-800 text-xl font-medium">Community</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Create Post Button */}
        <div className="mb-6 animate-fade-in">
          <Button 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
            onClick={() => setShowCreatePost(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create a Post
          </Button>
        </div>

        {/* Tabs for different sections */}
        <div className="animate-fade-in">
          <Tabs defaultValue="community" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/95 backdrop-blur-md border border-gray-200 mb-6">
              <TabsTrigger value="community" className="text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 text-xs">
                Posts
              </TabsTrigger>
              <TabsTrigger value="your-posts" className="text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 text-xs">
                Your Posts
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 text-xs">
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="family" className="text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800 text-xs">
                Family
              </TabsTrigger>
            </TabsList>

            <TabsContent value="community" className="space-y-6">
              {loading ? (
                <div className="text-center text-gray-500 py-8">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
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
            </TabsContent>

            <TabsContent value="your-posts" className="space-y-6">
              {loading ? (
                <div className="text-center text-gray-500 py-8">Loading your posts...</div>
              ) : userPosts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>You haven't created any posts yet.</p>
                </div>
              ) : (
                userPosts.map((post) => (
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
                ))
              )}
            </TabsContent>

            <TabsContent value="leaderboard">
              <div className="bg-white/95 backdrop-blur-md rounded-lg border border-gray-200 p-6">
                <CommunityLeaderboard />
              </div>
            </TabsContent>

            <TabsContent value="family">
              <div className="bg-white/95 backdrop-blur-md rounded-lg border border-gray-200 p-6">
                <FamilyMembersView />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Home className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Music className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/pulse")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Pulse</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-800 text-xs font-medium">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Lumina</span>
          </div>
        </div>
      </div>

      <CreatePostDialog
        open={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handlePostCreated}
      />
    </div>
  );
};

export default Community;
