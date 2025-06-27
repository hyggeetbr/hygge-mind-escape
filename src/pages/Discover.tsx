
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Play, Pause, Home, Users, Bot, Music, Heart, Clock, Volume2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Discover = () => {
  const navigate = useNavigate();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const audioSections = [
    {
      title: "Morning Affirmations",
      description: "Start your day with positive energy",
      icon: "🌅",
      color: "from-orange-500 to-yellow-500",
      tracks: []
    },
    {
      title: "Daily Wisdom", 
      description: "Inspirational thoughts for reflection",
      icon: "🧠",
      color: "from-purple-500 to-indigo-500",
      tracks: []
    },
    {
      title: "Sleep Sounds",
      description: "Peaceful sounds for better rest",
      icon: "🌙",
      color: "from-blue-500 to-purple-600",
      tracks: []
    }
  ];

  const yourPlaylist = [];

  const handlePlayTrack = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
        <h1 className="text-white text-xl font-medium">Explore</h1>
        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white">
          <Search size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-white text-3xl font-light mb-2">Good Morning</h2>
          <p className="text-white/70 text-lg">
            Discover audio content to enhance your mindful journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Search className="w-5 h-5 text-white/60" />
              <input 
                type="text" 
                placeholder="Search for affirmations, wisdom, sounds..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/60"
              />
            </div>
          </div>
        </div>

        {/* Audio Sections */}
        {audioSections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-8 animate-fade-in" style={{ animationDelay: `${0.2 + sectionIndex * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center text-xl mr-4`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold">{section.title}</h3>
                  <p className="text-white/60 text-sm">{section.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>

            {section.tracks.length === 0 ? (
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
                <Music className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No tracks yet</p>
                <p className="text-white/40 text-sm">Upload your first audio file to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {section.tracks.map((track: any, trackIndex) => (
                  <div 
                    key={track.id}
                    className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    onClick={() => handlePlayTrack(track.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                          {playingTrack === track.id ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{track.title}</h4>
                          <div className="flex items-center space-x-3 text-white/60 text-sm">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{track.duration}</span>
                            </span>
                            <span>{track.plays} plays</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Your Playlist Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-semibold">Your Playlists</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Music className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
          
          {yourPlaylist.length === 0 ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <Music className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 mb-2">No playlists yet</p>
              <p className="text-white/40 text-sm">Create your first playlist to organize your favorite tracks</p>
              <Button className="mt-4 bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 text-white">
                <Music className="w-4 h-4 mr-2" />
                Create Your First Playlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {yourPlaylist.map((playlist: any) => (
                <div 
                  key={playlist.id}
                  className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${playlist.image} rounded-lg flex items-center justify-center`}>
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-lg">{playlist.title}</h4>
                      <p className="text-white/60 text-sm">{playlist.tracks} tracks • {playlist.duration}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <Play className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Now Playing Bar */}
      {playingTrack && (
        <div className="fixed bottom-24 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Now Playing</p>
                <p className="text-white/60 text-sm">Track is playing...</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPlayingTrack(null)}
                className="text-white hover:bg-white/10"
              >
                <Pause className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 z-30">
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
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">🔍</div>
            <span className="text-white text-xs font-medium">Explore</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
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
