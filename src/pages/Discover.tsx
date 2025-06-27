
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Play, Pause, Home, Users, Bot, Music, Heart, Clock, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAudioTracks } from "@/hooks/useAudioTracks";
import { useUserPlaylists } from "@/hooks/useUserPlaylists";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useUserLikes } from "@/hooks/useUserLikes";

const Discover = () => {
  const navigate = useNavigate();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [fullScreenTrack, setFullScreenTrack] = useState<any | null>(null);
  const [currentTrackList, setCurrentTrackList] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [trackCategory, setTrackCategory] = useState<string>('');

  // Fetch audio tracks for each category
  const { tracks: morningTracks, loading: morningLoading, incrementPlayCount: incrementMorningPlay } = useAudioTracks('morning_affirmations');
  const { tracks: wisdomTracks, loading: wisdomLoading, incrementPlayCount: incrementWisdomPlay } = useAudioTracks('daily_wisdom');
  const { tracks: sleepTracks, loading: sleepLoading, incrementPlayCount: incrementSleepPlay } = useAudioTracks('sleep_sounds');
  
  // Fetch user likes
  const { likedTracks, loading: likesLoading, toggleLike, isTrackLiked } = useUserLikes();

  const audioSections = [
    {
      title: "Morning Affirmations",
      description: "Start your day with positive energy",
      icon: "🌅",
      color: "from-orange-500 to-yellow-500",
      tracks: morningTracks,
      loading: morningLoading,
      incrementPlayCount: incrementMorningPlay,
      category: 'morning_affirmations'
    },
    {
      title: "Daily Wisdom", 
      description: "Inspirational thoughts for reflection",
      icon: "🧠",
      color: "from-purple-500 to-indigo-500",
      tracks: wisdomTracks,
      loading: wisdomLoading,
      incrementPlayCount: incrementWisdomPlay,
      category: 'daily_wisdom'
    },
    {
      title: "Sleep Sounds",
      description: "Peaceful sounds for better rest",
      icon: "🌙",
      color: "from-blue-500 to-purple-600",
      tracks: sleepTracks,
      loading: sleepLoading,
      incrementPlayCount: incrementSleepPlay,
      category: 'sleep_sounds'
    }
  ];

  const handlePlayTrack = async (trackId: string, fileUrl: string, incrementPlayCount: (id: string) => void, track: any, trackList?: any[], category?: string) => {
    console.log('Playing track:', trackId, fileUrl);
    
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    setPlayingTrack(null);
    
    // Set up track list and index
    const tracks = trackList || [];
    const trackIndex = tracks.findIndex(t => t.id === trackId);
    
    setCurrentTrackList(tracks);
    setCurrentTrackIndex(trackIndex >= 0 ? trackIndex : 0);
    setFullScreenTrack(track);
    setTrackCategory(category || '');
    incrementPlayCount(trackId);
  };

  const handleTrackChange = (newTrack: any, newIndex: number) => {
    setFullScreenTrack(newTrack);
    setCurrentTrackIndex(newIndex);
    
    // Find the section this track belongs to and increment play count
    const section = audioSections.find(s => s.tracks.some(t => t.id === newTrack.id));
    if (section) {
      section.incrementPlayCount(newTrack.id);
    }
  };

  const handleSectionClick = (category: string) => {
    setSelectedSection(category);
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = (tracks: any[]) => {
    const totalSeconds = tracks.reduce((total, track) => total + (track.duration_seconds || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleLikeTrack = async (track: any, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLike(track.id);
  };

  if (fullScreenTrack) {
    return (
      <AudioPlayer 
        track={fullScreenTrack} 
        trackList={currentTrackList}
        currentIndex={currentTrackIndex}
        onClose={() => setFullScreenTrack(null)}
        onTrackChange={handleTrackChange}
        category={trackCategory}
      />
    );
  }

  // Show section details view
  if (selectedSection) {
    const section = audioSections.find(s => s.category === selectedSection);
    if (!section) return null;

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
            onClick={handleBackToSections}
            className="text-white/80 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-white text-xl font-medium">{section.title}</h1>
          <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white">
            <Search size={20} />
          </Button>
        </div>

        {/* Section Header */}
        <div className="relative z-10 px-6 mb-8">
          <div className={`w-full h-64 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center mb-6`}>
            <div className="text-center text-white">
              <div className="text-6xl mb-4">{section.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
              <p className="text-lg opacity-80">{section.description}</p>
              <p className="text-sm opacity-60 mt-2">{getTotalDuration(section.tracks)} • {section.tracks.length} tracks</p>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="relative z-10 px-6 pb-32">
          {section.loading ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <Music className="w-12 h-12 text-white/30 mx-auto mb-4 animate-pulse" />
              <p className="text-white/60">Loading tracks...</p>
            </div>
          ) : section.tracks.length === 0 ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <Music className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 mb-2">No tracks yet</p>
              <p className="text-white/40 text-sm">Audio tracks will appear here once uploaded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {section.tracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => handlePlayTrack(track.id, track.file_url, section.incrementPlayCount, track, section.tracks, section.category)}
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
          <h2 className="text-white text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>Hygge Echo</h2>
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
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all duration-300"
              onClick={() => handleSectionClick(section.category)}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center text-xl mr-4`}>
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold">{section.title}</h3>
                  <p className="text-white/60 text-sm">{section.description} • {getTotalDuration(section.tracks)}</p>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5 text-white/60 rotate-180" />
            </div>
          </div>
        ))}

        {/* Your Likes Section */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-xl font-semibold">Your Likes</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Heart className="w-4 h-4 mr-2" />
              {likedTracks.length}
            </Button>
          </div>
          
          {likesLoading ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <Heart className="w-12 h-12 text-white/30 mx-auto mb-4 animate-pulse" />
              <p className="text-white/60">Loading likes...</p>
            </div>
          ) : likedTracks.length === 0 ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-8 text-center">
              <Heart className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 mb-2">No liked tracks yet</p>
              <p className="text-white/40 text-sm">Tracks you like will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {likedTracks.map((track) => (
                <div 
                  key={track.id}
                  className="bg-white/5 border border-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => handlePlayTrack(track.id, track.file_url, () => {}, track, likedTracks)}
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
                      className="text-red-500 hover:text-red-600 hover:bg-white/10"
                      onClick={(e) => handleLikeTrack(track, e)}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
