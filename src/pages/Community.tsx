
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Heart, MessageCircle, Share2, Star, Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Community = () => {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const postOfTheDay = {
    id: "potd-1",
    author: "Sarah Chen",
    avatar: "from-pink-400 to-rose-500",
    content: "Today I realized that mindfulness isn't about emptying your mind, but about making space for what truly matters. Every breath is a new beginning. 🌸",
    likes: 127,
    comments: 23,
    timeAgo: "6h ago",
    badge: "🏆"
  };

  const communityPosts = [
    {
      id: "post-1",
      author: "Alex Rivera",
      avatar: "from-blue-400 to-cyan-500",
      content: "Just finished my 30-day meditation streak! The journey has been incredible. Starting small with 5 minutes daily changed everything.",
      likes: 45,
      comments: 12,
      timeAgo: "2h ago",
      badge: "🌟"
    },
    {
      id: "post-2",
      author: "Maya Patel",
      avatar: "from-green-400 to-emerald-500",
      content: "Sharing my morning routine: 10 min meditation, gratitude journaling, and herbal tea. Simple but transformative. What's yours?",
      likes: 62,
      comments: 18,
      timeAgo: "4h ago",
      badge: "✨"
    },
    {
      id: "post-3",
      author: "David Kim",
      avatar: "from-purple-400 to-violet-500",
      content: "Found peace in chaos today. Even in the busiest moments, we can find our center. Remember to breathe. 🧘‍♂️",
      likes: 38,
      comments: 9,
      timeAgo: "8h ago",
      badge: "🎯"
    }
  ];

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleShare = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Inspiring Post from Hygge Community',
        text: content,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(content + ' - Shared from Hygge Community')}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleCompose = () => {
    // TODO: Navigate to compose post page
    console.log("Navigate to compose post");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSleep = () => {
    navigate("/sleep");
  };

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handlePremium = () => {
    navigate("/premium");
  };

  const handleLeaderboard = () => {
    navigate("/leaderboard");
  };

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
          onClick={handleCompose}
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

        {/* Post of the Day */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-medium flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-calm-orange" />
              Post of the Day
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLeaderboard}
              className="text-white/80 hover:bg-white/10 text-sm"
            >
              Leaderboard
            </Button>
          </div>
          
          <div className="calm-card p-6 border-2 border-calm-orange/30">
            <div className="flex items-start space-x-4 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${postOfTheDay.avatar} rounded-full flex items-center justify-center text-white font-semibold`}>
                {postOfTheDay.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-800">{postOfTheDay.author}</h4>
                  <span className="text-xl">{postOfTheDay.badge}</span>
                  <div className="w-2 h-2 bg-calm-orange rounded-full"></div>
                  <span className="text-gray-500 text-sm">{postOfTheDay.timeAgo}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">{postOfTheDay.content}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(postOfTheDay.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    likedPosts.has(postOfTheDay.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedPosts.has(postOfTheDay.id) ? 'fill-current' : ''}`} />
                  <span className="text-sm">{postOfTheDay.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-calm-purple transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">{postOfTheDay.comments}</span>
                </button>
                <button
                  onClick={() => handleShare(postOfTheDay.content)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-calm-blue transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Community Posts */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {communityPosts.map((post, index) => (
              <div 
                key={post.id}
                className="calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${post.avatar} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-800">{post.author}</h4>
                      <span>{post.badge}</span>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-500 text-sm">{post.timeAgo}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className={`flex items-center space-x-1 transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-calm-purple transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post.content);
                      }}
                      className="flex items-center space-x-1 text-gray-500 hover:text-calm-blue transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDashboard}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/60 rounded-sm"></div>
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleSleep}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">🌙</div>
            <span className="text-white/60 text-xs">Sleep</span>
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
              <div className="w-4 h-4 bg-calm-purple rounded-sm"></div>
            </div>
            <span className="text-white text-xs font-medium">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleProfile}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">👤</div>
            <span className="text-white/60 text-xs">Profile</span>
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
