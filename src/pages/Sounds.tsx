
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, Play, Pause, Home, Users, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Sounds = () => {
  const navigate = useNavigate();
  const [playingSound, setPlayingSound] = useState<string | null>(null);

  const soundCategories = [
    {
      title: "Nature Sounds",
      description: "Peaceful sounds from the natural world",
      duration: "Endless loops",
      icon: "🌿",
      color: "from-green-500 to-emerald-600",
      sounds: ["Rain", "Ocean Waves", "Forest Birds", "Thunderstorm"]
    },
    {
      title: "White Noise",
      description: "Consistent sounds for focus and relaxation",
      duration: "Continuous",
      icon: "⚪",
      color: "from-gray-400 to-gray-600",
      sounds: ["Brown Noise", "Pink Noise", "Fan Sound", "Static"]
    },
    {
      title: "Ambient Music",
      description: "Atmospheric music for deep relaxation",
      duration: "30 min - 2 hours",
      icon: "🎵",
      color: "from-purple-500 to-indigo-600",
      sounds: ["Space Ambient", "Meditation Bells", "Drone Sounds", "Ethereal Pads"]
    },
    {
      title: "Urban Sounds",
      description: "City sounds for concentration",
      duration: "1-4 hours",
      icon: "🏙️",
      color: "from-blue-500 to-cyan-600",
      sounds: ["Coffee Shop", "Library", "Train Journey", "Busy Street"]
    }
  ];

  const featuredSounds = [
    { name: "Gentle Rain", category: "Nature", duration: "45 min" },
    { name: "Ocean Waves", category: "Nature", duration: "60 min" },
    { name: "Brown Noise", category: "White Noise", duration: "Endless" },
    { name: "Forest Morning", category: "Nature", duration: "30 min" }
  ];

  const handlePlaySound = (soundName: string) => {
    if (playingSound === soundName) {
      setPlayingSound(null);
    } else {
      setPlayingSound(soundName);
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handleCommunity = () => {
    navigate("/community");
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
        <h1 className="text-white text-xl font-medium">Sounds</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-white text-3xl font-light mb-4">Ambient Sounds</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Immerse yourself in calming soundscapes designed to enhance focus, relaxation, and well-being.
          </p>
        </div>

        {/* Sound Categories */}
        <div className="space-y-4 animate-fade-in mb-8" style={{ animationDelay: "0.1s" }}>
          {soundCategories.map((category, index) => (
            <div 
              key={category.title}
              className="calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-lg mb-1">{category.title}</h3>
                  <p className="text-gray-600 mb-2">{category.description}</p>
                  <p className="text-calm-purple text-sm font-medium">{category.duration}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.sounds.map((sound) => (
                      <span key={sound} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {sound}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Sounds */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Popular Sounds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredSounds.map((sound) => (
              <div key={sound.name} className="calm-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-black">{sound.name}</h4>
                    <p className="text-gray-600 text-sm">{sound.category}</p>
                    <p className="text-calm-purple text-xs">{sound.duration}</p>
                  </div>
                  <Button
                    onClick={() => handlePlaySound(sound.name)}
                    variant="ghost"
                    size="icon"
                    className="text-calm-purple hover:bg-calm-purple/10"
                  >
                    {playingSound === sound.name ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Now Playing */}
        {playingSound && (
          <div className="fixed bottom-24 left-6 right-6 calm-card p-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-black">Now Playing</p>
                <p className="text-gray-600 text-sm">{playingSound}</p>
              </div>
              <Button
                onClick={() => setPlayingSound(null)}
                variant="ghost"
                size="icon"
                className="text-calm-purple hover:bg-calm-purple/10"
              >
                <Pause className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDashboard}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Home className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-calm-purple" />
            </div>
            <span className="text-white text-xs font-medium">Sounds</span>
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
              <Users className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Community</span>
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

export default Sounds;
