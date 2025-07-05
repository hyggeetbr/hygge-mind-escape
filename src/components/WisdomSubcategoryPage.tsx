import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music, Play, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAudioTracks } from "@/hooks/useAudioTracks";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useUserLikes } from "@/hooks/useUserLikes";

interface WisdomSubcategoryPageProps {
  title: string;
  description: string;
  subcategory: string;
  icon: React.ReactNode;
  color: string;
}

const WisdomSubcategoryPage = ({ title, description, subcategory, icon, color }: WisdomSubcategoryPageProps) => {
  const navigate = useNavigate();
  const [fullScreenTrack, setFullScreenTrack] = useState<any | null>(null);
  const [currentTrackList, setCurrentTrackList] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Fetch audio tracks for this subcategory
  const { tracks, loading, incrementPlayCount } = useAudioTracks('daily_wisdom', subcategory);
  const { likedTracks, toggleLike, isTrackLiked } = useUserLikes();

  const handlePlayTrack = (track: any, trackList: any[]) => {
    const trackIndex = trackList.findIndex(t => t.id === track.id);
    setCurrentTrackList(trackList);
    setCurrentTrackIndex(trackIndex >= 0 ? trackIndex : 0);
    setFullScreenTrack(track);
    incrementPlayCount(track.id);
  };

  const handleTrackChange = (newTrack: any, newIndex: number) => {
    setFullScreenTrack(newTrack);
    setCurrentTrackIndex(newIndex);
    incrementPlayCount(newTrack.id);
  };

  const handleLikeTrack = async (track: any, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLike(track.id);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (fullScreenTrack) {
    return (
      <AudioPlayer 
        track={fullScreenTrack} 
        trackList={currentTrackList}
        currentIndex={currentTrackIndex}
        onClose={() => setFullScreenTrack(null)}
        onTrackChange={handleTrackChange}
        category="daily_wisdom"
      />
    );
  }

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
          onClick={() => navigate("/daily-wisdom-sections")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">{title}</h1>
        <div className="w-10"></div>
      </div>

      {/* Section Header */}
      <div className="relative z-10 px-6 mb-8">
        <div className={`w-full h-64 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6`}>
          <div className="text-center text-white">
            <div className="mb-4">{icon}</div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-lg opacity-80">{description}</p>
            <p className="text-sm opacity-60 mt-2">{tracks.length} tracks available</p>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="relative z-10 px-6 pb-32">
        {loading ? (
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
            <Music className="w-12 h-12 text-white/30 mx-auto mb-4 animate-pulse" />
            <p className="text-white/60">Loading tracks...</p>
          </div>
        ) : tracks.length === 0 ? (
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
            <Music className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 mb-2">No tracks yet</p>
            <p className="text-white/40 text-sm">Audio tracks will appear here once uploaded</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div 
                key={track.id}
                className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                onClick={() => handlePlayTrack(track, tracks)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={track.cover_art_url || "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"} 
                        alt={track.title}
                        className="w-12 h-12 rounded-lg object-cover shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{track.title}</h4>
                      <div className="flex items-center space-x-3 text-white/60 text-sm">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(track.duration_seconds)}</span>
                        </span>
                        <span>{track.play_count} plays</span>
                        {track.artist && <span>• {track.artist}</span>}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isTrackLiked(track.id) ? 'text-red-500' : 'text-white/60'} hover:text-red-500 hover:bg-white/10`}
                    onClick={(e) => handleLikeTrack(track, e)}
                  >
                    <Heart className={`w-4 h-4 ${isTrackLiked(track.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-black" />
            </div>
            <span className="text-white text-xs font-medium">Echo</span>
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
        </div>
      </div>
    </div>
  );
};

export default WisdomSubcategoryPage;
