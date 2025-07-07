
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Star, Cloud, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sleep = () => {
  const navigate = useNavigate();

  const sleepContent = [
    {
      title: "Deep Sleep Stories",
      description: "Drift away with calming narratives",
      duration: "15-45 min",
      icon: Moon,
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Sleep Meditation",
      description: "Guided meditations for restful sleep",
      duration: "10-30 min", 
      icon: Star,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Nature Sounds",
      description: "Peaceful sounds to lull you to sleep",
      duration: "1-8 hours",
      icon: Cloud,
      color: "from-blue-500 to-teal-500"
    },
    {
      title: "Sleep Music",
      description: "Gentle melodies for deep rest",
      duration: "30 min - 8 hours",
      icon: Zap,
      color: "from-green-500 to-blue-500"
    }
  ];

  const handleDashboard = () => {
    navigate("/dashboard");
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

  const handleCommunity = () => {
    navigate("/community");
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: `url('/lovable-uploads/2004a855-3429-476d-b43b-f05812ef647f.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
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
        <h1 className="text-white text-xl font-medium">Sleep</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-white text-3xl font-light mb-4">Sweet Dreams</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            End your day peacefully with our collection of sleep stories, meditations, and calming sounds.
          </p>
        </div>

        {/* Sleep Categories */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {sleepContent.map((item, index) => (
            <div 
              key={item.title}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/15"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
                  <p className="text-white/70 mb-2">{item.description}</p>
                  <p className="text-white/90 text-sm font-medium">{item.duration}</p>
                </div>
                <div className="text-white/40">›</div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Content */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Tonight's Featured</h3>
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-0 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center">
              <div className="text-center text-white">
                <Moon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <h4 className="text-xl font-medium mb-2">Moonlit Forest</h4>
                <p className="text-white/80 text-sm">A magical journey through an enchanted forest</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Sleep Story</p>
                  <p className="text-white/70 text-sm">25 minutes</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white rounded-full px-6 border border-white/30">
                  Listen Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/20 z-30">
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
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">🌙</div>
            <span className="text-white text-xs font-medium">Sleep</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDiscover}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">🔍</div>
            <span className="text-white/60 text-xs">Discover</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleCommunity}
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

export default Sleep;
