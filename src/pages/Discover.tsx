
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Sparkles, BookOpen, Music, Heart, TrendingUp, Brain, Leaf, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Discover = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Trending", icon: TrendingUp, color: "bg-calm-orange" },
    { name: "Mindfulness", icon: Brain, color: "bg-calm-purple" },
    { name: "Self-Care", icon: Heart, color: "bg-pink-500" },
    { name: "Nature", icon: Leaf, color: "bg-green-500" }
  ];

  const featuredContent = [
    {
      title: "7 Days of Mindfulness",
      category: "Program",
      image: "from-blue-400 to-purple-500",
      participants: "12.3K"
    },
    {
      title: "Morning Energy Boost",
      category: "Meditation",
      image: "from-yellow-400 to-orange-500",
      participants: "8.7K"
    },
    {
      title: "Stress Relief in 5 Minutes",
      category: "Quick Session",
      image: "from-green-400 to-teal-500",
      participants: "15.2K"
    }
  ];

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSounds = () => {
    navigate("/sounds");
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handlePremium = () => {
    navigate("/premium");
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
        <h1 className="text-white text-xl font-medium">Discover</h1>
        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white">
          <Search size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-white text-3xl font-light mb-4">Explore & Grow</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Discover new practices, programs, and insights to enhance your mindful journey.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="calm-card p-4">
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search meditations, programs, music..."
                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <div 
                key={category.name}
                className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Featured This Week</h3>
          <div className="space-y-4">
            {featuredContent.map((item, index) => (
              <div 
                key={item.title}
                className="calm-card p-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="flex">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.image} flex items-center justify-center`}>
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-4 flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                    <div className="flex items-center space-x-1 text-calm-purple text-xs">
                      <div className="w-2 h-2 bg-calm-purple rounded-full"></div>
                      <span>{item.participants} participants</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center">
                    <div className="text-gray-400">›</div>
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
            onClick={handleSounds}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Sounds</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">🔍</div>
            <span className="text-white text-xs font-medium">Discover</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3"/>
                <path d="m16 18 3 3"/>
              </svg>
            </div>
            <span className="text-white/60 text-xs">Community</span>
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

export default Discover;
