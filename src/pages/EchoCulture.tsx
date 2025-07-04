import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Earth component with realistic textures
function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Create earth texture (using a simple color for now, can be replaced with actual earth texture)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;
    
    if (context) {
      // Create a gradient that resembles Earth colors
      const gradient = context.createLinearGradient(0, 0, 512, 256);
      gradient.addColorStop(0, '#4A90E2');    // Ocean blue
      gradient.addColorStop(0.3, '#7ED321');  // Land green
      gradient.addColorStop(0.5, '#F5A623');  // Desert yellow
      gradient.addColorStop(0.7, '#8B572A');  // Mountain brown
      gradient.addColorStop(1, '#FFFFFF');    // Ice white
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 256);
      
      // Add some continent-like shapes
      context.fillStyle = '#228B22';
      context.beginPath();
      context.arc(100, 100, 40, 0, Math.PI * 2);
      context.fill();
      
      context.beginPath();
      context.arc(300, 80, 60, 0, Math.PI * 2);
      context.fill();
      
      context.beginPath();
      context.arc(400, 150, 50, 0, Math.PI * 2);
      context.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <Sphere ref={earthRef} args={[2, 32, 32]} position={[0, 0, 0]}>
      <meshPhongMaterial 
        map={earthTexture}
        shininess={100}
        specular={new THREE.Color(0x111111)}
      />
    </Sphere>
  );
}

const EchoCulture = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/discover")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Echo Culture</h1>
        <div className="w-10"></div>
      </div>

      {/* Instructions */}
      <div className="relative z-20 px-6 mb-4">
        <p className="text-white/70 text-center text-sm">
          Rotate the Earth to explore stories and folklore from different cultures
        </p>
      </div>

      {/* 3D Earth Canvas */}
      <div className="relative z-10 h-[calc(100vh-200px)]">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Ambient lighting */}
          <ambientLight intensity={0.3} />
          
          {/* Directional light (sun) */}
          <directionalLight 
            position={[5, 3, 5]} 
            intensity={1} 
            castShadow 
          />
          
          {/* Point light for additional illumination */}
          <pointLight position={[-5, -3, -5]} intensity={0.5} />
          
          {/* Stars background */}
          <Stars 
            radius={300} 
            depth={60} 
            count={5000} 
            factor={7} 
            saturation={0} 
            fade 
            speed={0.5}
          />
          
          {/* Earth */}
          <Earth />
          
          {/* Controls for rotation */}
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.05}
            screenSpacePanning={false}
            minDistance={3}
            maxDistance={10}
            maxPolarAngle={Math.PI}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Coming Soon Message */}
      <div className="relative z-20 px-6 pb-32">
        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-6 text-center">
          <h3 className="text-white text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-white/70 text-sm">
            Interactive cultural stories and folklore from around the world will be available here soon. 
            Click on different regions to discover their unique tales and traditions.
          </p>
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
              <ArrowLeft className="w-4 h-4 text-white/60 rotate-180" />
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <div className="w-4 h-4 text-white/60">🎵</div>
            </div>
            <span className="text-white/60 text-xs">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <div className="w-4 h-4 text-white/60">👥</div>
            </div>
            <span className="text-white/60 text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <div className="w-4 h-4 text-white/60">🤖</div>
            </div>
            <span className="text-white/60 text-xs">Lumina</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchoCulture;