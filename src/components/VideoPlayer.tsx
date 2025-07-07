
import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    description: string | null;
    file_url: string;
    view_count: number;
  };
  onClose: () => void;
  onViewIncrement: (videoId: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  onClose, 
  onViewIncrement 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start tracking time when video plays
  const handlePlay = () => {
    if (!hasStarted) {
      onViewIncrement(video.id);
      setHasStarted(true);
    }
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setWatchedSeconds(prev => prev + 1);
    }, 1000);
  };

  // Stop tracking time when video pauses or ends
  const handlePauseOrEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Update meditation minutes in database
  useEffect(() => {
    const updateMeditationMinutes = async () => {
      if (user && watchedSeconds > 0 && watchedSeconds % 60 === 0) {
        // Update every minute
        const minutesToAdd = 1;
        
        try {
          await supabase.rpc('update_daily_activity', {
            p_user_id: user.id,
            p_activity_type: 'meditation',
            p_minutes: minutesToAdd
          });
        } catch (error) {
          console.error('Error updating meditation minutes:', error);
        }
      }
    };

    updateMeditationMinutes();
  }, [watchedSeconds, user]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  const handleClose = () => {
    // Final update for any remaining seconds
    if (user && watchedSeconds > 0) {
      const remainingMinutes = Math.floor((watchedSeconds % 60) / 60);
      if (remainingMinutes > 0) {
        supabase.rpc('update_daily_activity', {
          p_user_id: user.id,
          p_activity_type: 'meditation',
          p_minutes: remainingMinutes
        }).catch(console.error);
      }
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl mx-auto flex flex-col">
        {/* Header with close button and timer */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-semibold">{video.title}</h2>
              {video.description && (
                <p className="text-white/70 text-sm mt-1">{video.description}</p>
              )}
              <p className="text-white/60 text-xs mt-1">
                Meditation time: {formatTime(watchedSeconds)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white hover:bg-white/20"
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        {/* Video Player - No controls */}
        <div className="flex-1 flex items-center justify-center relative">
          <video
            ref={videoRef}
            src={video.file_url}
            className="w-full h-full object-contain"
            onPlay={handlePlay}
            onPause={handlePauseOrEnd}
            onEnded={handlePauseOrEnd}
            controls={false}
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
          />
        </div>
      </div>
    </div>
  );
};
