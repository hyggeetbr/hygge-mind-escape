
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Volume2, Play, Clock } from "lucide-react";
import { useVideoTracks } from "@/hooks/useVideoTracks";
import { VideoPlayer } from "@/components/VideoPlayer";
import ThemeSelector from "@/components/ThemeSelector";

const Meditate = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [currentBackground, setCurrentBackground] = useState("url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')");
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
          background: currentBackground,
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
        background: currentBackground,
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
                  <div className="relative h-32 bg-gradient-to-br from-botanical-purple via-botanical-purple to-botanical-lavender flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                    <div className="text-white text-lg font-medium z-10">{video.title.toUpperCase()}</div>
                    <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-white/80 text-sm">
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

        {/* Categories */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-botanical-blue/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-botanical-blue text-xl">🧘</span>
              </div>
              <div className="font-medium text-botanical-text-dark text-sm">Meditation</div>
            </div>

            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-500 text-xl">🎵</span>
              </div>
              <div className="font-medium text-botanical-text-dark text-sm">Music</div>
            </div>
          </div>
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
                className="text-botanical-text-light"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <span className="text-botanical-text-light text-xs">Home</span>
          </div>
          <div
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/sounds")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Sounds</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">🔍</div>
            <span className="text-botanical-text-light text-xs">Discover</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
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
                className="text-botanical-text-light"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3"/>
                <path d="m16 18 3 3"/>
              </svg>
            </div>
            <span className="text-botanical-text-light text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
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
                className="text-botanical-text-light"
              >
                <path d="M12 8V4M4 8H20M6.9 15H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2M17 15h1.9a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2M15 8a3 3 0 1 0-6 0"/>
              </svg>
            </div>
            <span className="text-botanical-text-light text-xs">Lumina</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/premium")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">⭐</div>
            <span className="text-botanical-text-light text-xs">Premium</span>
          </div>
        </div>
      </div>

      <ThemeSelector onThemeChange={setCurrentBackground} />
    </div>
  );
};

export default Meditate;
