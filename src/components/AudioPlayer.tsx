
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Share, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AudioTrack } from '@/hooks/useAudioTracks';

interface AudioPlayerProps {
  track: AudioTrack;
  trackList: AudioTrack[];
  currentIndex: number;
  onClose: () => void;
  onTrackChange: (track: AudioTrack, index: number) => void;
}

export const AudioPlayer = ({ track, trackList, currentIndex, onClose, onTrackChange }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext(); // Auto-play next track when current ends
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Reset audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [track.id]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (trackList.length <= 1) return;

    let nextIndex;
    
    if (repeatMode === 'one') {
      // Stay on the same track
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        if (isPlaying) audio.play();
      }
      return;
    }

    if (isShuffled) {
      // Random next track (excluding current)
      const availableIndices = trackList.map((_, i) => i).filter(i => i !== currentIndex);
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Sequential next track
      nextIndex = currentIndex + 1;
      if (nextIndex >= trackList.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return; // Don't play next if at end and no repeat
        }
      }
    }

    onTrackChange(trackList[nextIndex], nextIndex);
  };

  const handlePrevious = () => {
    if (trackList.length <= 1) return;

    const audio = audioRef.current;
    
    // If more than 3 seconds played, restart current track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIndex;
    
    if (isShuffled) {
      // Random previous track (excluding current)
      const availableIndices = trackList.map((_, i) => i).filter(i => i !== currentIndex);
      prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Sequential previous track
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        if (repeatMode === 'all') {
          prevIndex = trackList.length - 1;
        } else {
          return; // Don't play previous if at start and no repeat
        }
      }
    }

    onTrackChange(trackList[prevIndex], prevIndex);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return '🔂';
    if (repeatMode === 'all') return '🔁';
    return '🔁';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 z-50 flex flex-col">
      <audio ref={audioRef} src={track.file_url} preload="metadata" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft size={24} />
        </Button>
        <div className="text-center">
          <p className="text-sm opacity-80">PLAYING FROM MORNING AFFIRMATIONS</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <MoreHorizontal size={24} />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-80 h-80 bg-white/10 rounded-lg backdrop-blur-md flex items-center justify-center">
          <img 
            src={track.cover_art_url || "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"} 
            alt={track.title}
            className="w-full h-full object-cover rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="px-6 py-4 text-center text-white">
        <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
        <p className="text-lg opacity-80">{track.artist || "Unknown Artist"}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-2">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-white text-sm mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(duration - currentTime)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8 py-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleShuffle}
          className={`text-white hover:bg-white/20 ${isShuffled ? 'bg-white/20' : ''}`}
        >
          <Shuffle size={24} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="text-white hover:bg-white/20"
          disabled={trackList.length <= 1}
        >
          <SkipBack size={32} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="text-white hover:bg-white/20 w-16 h-16 rounded-full bg-white/20"
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="text-white hover:bg-white/20"
          disabled={trackList.length <= 1}
        >
          <SkipForward size={32} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRepeat}
          className={`text-white hover:bg-white/20 ${repeatMode !== 'none' ? 'bg-white/20' : ''}`}
        >
          <Repeat size={24} />
          {repeatMode === 'one' && <span className="absolute -top-1 -right-1 text-xs">1</span>}
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/20">
        <div className="flex items-center space-x-2">
          <Volume2 className="text-white" size={20} />
          <Slider
            value={[volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Share size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
