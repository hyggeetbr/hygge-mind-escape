
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Home, Users, Bot, Music, Zap, Play, Clock } from "lucide-react";
import { useVideoTracks } from "@/hooks/useVideoTracks";
import { VideoPlayer } from "@/components/VideoPlayer";

const Meditate = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const { tracks, loading: tracksLoading, incrementViewCount } = useVideoTracks('meditation');

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ 
          backgroundImage: "url('/lovable-uploads/3b468853-d557-4c9b-a5b1-3b7d5c1b40d8.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="text-botanical-text-dark text-2xl font-light animate-pulse">Hygge</div>
      </div>
    );
  }

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
  };

  const handleRadhaMeditation = () => {
    navigate("/radha-meditation");
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (selectedVideo) {
    return (
      <VideoPlayer 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)}
        onViewIncrement={incrementViewCount}
      />
    );
  }

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        backgroundImage: "url('/lovable-uploads/3b468853-d557-4c9b-a5b1-3b7d5c1b40d8.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-botanical-lavender/30 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-botanical-sage/25 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-botanical-cream/40 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-botanical-text-dark hover:bg-white/90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-botanical-text-dark text-xl font-medium">Meditation</div>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-botanical-text-dark text-2xl font-light mb-2">
            Meditation Videos
          </h1>
          <p className="text-botanical-text-medium text-sm italic">
            Guided meditation practices for inner peace
          </p>
        </div>

        {/* Meditation Types Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <h2 className="text-botanical-text-dark text-lg font-medium mb-4">Meditation Types</h2>
          
          <div className="space-y-3">
            {/* Breath Awareness */}
            <div className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-botanical-sage/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌬️</span>
                </div>
                <div>
                  <h3 className="font-medium text-botanical-text-dark">Breath Awareness</h3>
                  <p className="text-botanical-text-medium text-sm">Focus on the natural rhythm of your breath</p>
                </div>
              </div>
            </div>

            {/* Radha Meditation */}
            <div 
              onClick={handleRadhaMeditation}
              className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="font-medium text-botanical-text-dark">Radha Meditation</h3>
                  <p className="text-botanical-text-medium text-sm">7-minute cosmic meditation under the stars</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-botanical-text-dark text-lg font-medium mb-4">Available Videos</h2>
          
          {tracksLoading ? (
            <div className="calm-card p-8 text-center">
              <div className="text-botanical-text-medium animate-pulse">Loading meditation videos...</div>
            </div>
          ) : tracks.length === 0 ? (
            <div className="calm-card p-8 text-center">
              <div className="text-6xl mb-4">🧘</div>
              <div className="text-botanical-text-medium mb-2">No meditation videos yet</div>
              <div className="text-botanical-text-light text-sm">Videos will appear here once uploaded</div>
            </div>
          ) : (
            <div className="space-y-4">
              {tracks.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="calm-card p-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="relative h-32 bg-gradient-to-br from-botanical-purple via-botanical-purple to-botanical-lavender flex items-center justify-between px-6">
                    <div className="flex items-center space-x-4">
                      <Play className="w-12 h-12 text-white opacity-80" />
                      <div className="text-white text-lg font-medium">{video.title.toUpperCase()}</div>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded"></div>
                      </div>
                      <span>{video.view_count} views</span>
                      {video.duration_seconds && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(video.duration_seconds)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-medium text-botanical-text-dark mb-1">{video.title}</div>
                    {video.description && (
                      <div className="text-botanical-text-medium text-sm">{video.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-botanical-purple/30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Home className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Music className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/pulse")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Zap className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Pulse</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Users className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Bot className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Lumina</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meditate;
