
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Play, Pause, Square } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Stars background component
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (starsRef.current) {
      const positions = new Float32Array(3000 * 3);
      for (let i = 0; i < 3000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 400;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
      }
      starsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial color="white" size={1.5} sizeAttenuation={false} />
    </points>
  );
}

const RadhaMeditation = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [timeLeft, setTimeLeft] = useState(7 * 60); // 7 minutes in seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isCompleted) {
      // Reset meditation
      setTimeLeft(7 * 60);
      setIsCompleted(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setTimeLeft(7 * 60);
    setIsCompleted(false);
  };

  const handleBack = () => {
    navigate("/meditate");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-light animate-pulse">Loading...</div>
      </div>
    );
  }

  const progress = ((7 * 60 - timeLeft) / (7 * 60)) * 100;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Stars Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Stars />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.2}
          />
        </Canvas>
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-white text-xl font-medium">Radha Meditation</div>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        {/* Timer Circle */}
        <div className="relative mb-12">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 blur-lg scale-110"></div>
          
          {/* Main timer circle */}
          <div className="relative w-80 h-80 rounded-full border-4 border-gray-600 flex items-center justify-center overflow-hidden">
            {/* Progress ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth="2"
                className="opacity-30"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer display */}
            <div className="text-center">
              <div className="text-6xl font-light text-white mb-2 tracking-wider">
                {formatTime(timeLeft)}
              </div>
              <div className="text-cyan-400 text-sm font-medium uppercase tracking-widest">
                {isCompleted ? "Complete" : isPlaying ? "Meditating" : "Ready"}
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-6">
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
          >
            {isCompleted ? (
              <Play size={24} />
            ) : isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
          </button>
          
          <button
            onClick={handleStop}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Square size={18} />
          </button>
        </div>

        {/* Meditation Quote */}
        <div className="mt-12 text-center max-w-md">
          <p className="text-white/70 text-lg font-light italic leading-relaxed">
            "In the silence between thoughts, find the infinite space of your true self."
          </p>
        </div>
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-white text-2xl font-light mb-2">Meditation Complete</h2>
            <p className="text-white/70 mb-6">You have completed your 7-minute Radha meditation session.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsCompleted(false)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full hover:from-cyan-300 hover:to-blue-400 transition-all"
              >
                Continue
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
              >
                Back to Meditation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadhaMeditation;
