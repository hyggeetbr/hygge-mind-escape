
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

// Simple Earth component that WILL be visible
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    console.log('Earth component mounted, mesh ref:', meshRef.current);
    if (meshRef.current) {
      console.log('Mesh position:', meshRef.current.position);
      console.log('Mesh scale:', meshRef.current.scale);
      console.log('Mesh visible:', meshRef.current.visible);
    }
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#4A90E2" />
    </mesh>
  );
}

// Fallback component
function FallbackEarth() {
  console.log('Fallback Earth component rendered');
  return (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
      <div className="w-64 h-64 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl">
        <div className="text-white text-6xl">🌍</div>
      </div>
    </div>
  );
}

const EchoCulture = () => {
  const navigate = useNavigate();
  const [canvasError, setCanvasError] = useState(false);

  useEffect(() => {
    console.log('EchoCulture component mounted');
  }, []);

  const handleCanvasCreated = (state: any) => {
    console.log('Canvas created successfully:', state);
    console.log('Renderer:', state.gl);
    console.log('Scene:', state.scene);
    console.log('Camera:', state.camera);
  };

  const handleCanvasError = (error: any) => {
    console.error('Canvas error:', error);
    setCanvasError(true);
  };

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
      <div className="relative z-10 h-[calc(100vh-200px)] bg-gray-900">
        {canvasError ? (
          <FallbackEarth />
        ) : (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
            onCreated={handleCanvasCreated}
            onError={handleCanvasError}
            dpr={[1, 2]}
            legacy={false}
          >
            {/* Simple lighting that will definitely work */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            
            {/* Earth - using the simplest possible approach */}
            <Earth />
            
            {/* Controls */}
            <OrbitControls 
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={true}
              autoRotateSpeed={1}
              minDistance={4}
              maxDistance={12}
            />
          </Canvas>
        )}
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
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 z-50">
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
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Music className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Echo</span>
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

export default EchoCulture;
