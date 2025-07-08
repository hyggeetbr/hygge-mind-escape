import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Home, Users, Bot, Music, Zap, Play, Pause, Square } from "lucide-react";

const Meditate = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [breathTimerActive, setBreathTimerActive] = useState(false);
  const [breathTimeLeft, setBreathTimeLeft] = useState(7 * 60); // 7 minutes in seconds
  const [breathTimerCompleted, setBreathTimerCompleted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // Breath Awareness Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (breathTimerActive && breathTimeLeft > 0) {
      interval = setInterval(() => {
        setBreathTimeLeft((prev) => {
          if (prev <= 1) {
            setBreathTimerActive(false);
            setBreathTimerCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathTimerActive, breathTimeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBreathPlayPause = () => {
    if (breathTimerCompleted) {
      // Reset meditation
      setBreathTimeLeft(7 * 60);
      setBreathTimerCompleted(false);
      setBreathTimerActive(true);
    } else {
      setBreathTimerActive(!breathTimerActive);
    }
  };

  const handleBreathStop = () => {
    setBreathTimerActive(false);
    setBreathTimeLeft(7 * 60);
    setBreathTimerCompleted(false);
  };

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

  const handleRadhaMeditation = () => {
    navigate("/radha-meditation");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const breathProgress = ((7 * 60 - breathTimeLeft) / (7 * 60)) * 100;

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
            Meditation Types
          </h1>
          <p className="text-botanical-text-medium text-sm italic">
            Choose your meditation practice
          </p>
        </div>

        {/* Meditation Types Section */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          {/* Breath Awareness - now clickable */}
          <div 
            onClick={() => navigate("/breath-awareness")}
            className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-botanical-sage/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌬️</span>
              </div>
              <div>
                <h3 className="font-medium text-botanical-text-dark">Breath Awareness</h3>
                <p className="text-botanical-text-medium text-sm">7-minute focused breathing meditation</p>
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

        {/* Completion Message for Breath Awareness */}
        {breathTimerCompleted && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 text-center border border-botanical-purple/20 mx-4">
              <div className="text-6xl mb-4">🌬️</div>
              <h2 className="text-botanical-text-dark text-2xl font-light mb-2">Breath Awareness Complete</h2>
              <p className="text-botanical-text-medium mb-6">You have completed your 7-minute breath awareness session.</p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => setBreathTimerCompleted(false)}
                  className="px-6 py-2 bg-botanical-sage/20 text-botanical-text-dark rounded-full hover:bg-botanical-sage/30 transition-all"
                >
                  Continue
                </button>
                <button
                  onClick={() => setBreathTimerCompleted(false)}
                  className="px-6 py-2 bg-white/70 text-botanical-text-dark rounded-full hover:bg-white/90 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
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
