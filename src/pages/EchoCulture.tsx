
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

// Stars background component
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (starsRef.current) {
      const positions = new Float32Array(1000 * 3);
      for (let i = 0; i < 1000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      }
      starsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial color="white" size={0.5} />
    </points>
  );
}

// Earth component with texture
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    console.log('Earth component mounted');
    
    // Load Earth texture
    const loader = new THREE.TextureLoader();
    
    // Using a publicly available Earth texture from NASA
    const earthTextureUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Land_ocean_ice_cloud_1024.jpg/1024px-Land_ocean_ice_cloud_1024.jpg';
    
    loader.load(
      earthTextureUrl,
      (loadedTexture) => {
        console.log('Earth texture loaded successfully');
        setTexture(loadedTexture);
      },
      (progress) => {
        console.log('Loading earth texture:', progress);
      },
      (error) => {
        console.error('Error loading earth texture:', error);
        // Fallback: create a simple earth-like texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        if (context) {
          // Create gradient for ocean
          const gradient = context.createLinearGradient(0, 0, 512, 256);
          gradient.addColorStop(0, '#4A90E2');
          gradient.addColorStop(0.3, '#2E86C1');
          gradient.addColorStop(0.7, '#1B4F72');
          gradient.addColorStop(1, '#154360');
          
          context.fillStyle = gradient;
          context.fillRect(0, 0, 512, 256);
          
          // Add some landmass-like shapes
          context.fillStyle = '#8D6E63';
          context.fillRect(100, 80, 80, 60);
          context.fillRect(200, 100, 100, 40);
          context.fillRect(350, 70, 90, 80);
          context.fillRect(50, 150, 120, 50);
          context.fillRect(300, 160, 150, 70);
          
          context.fillStyle = '#4CAF50';
          context.fillRect(110, 90, 60, 40);
          context.fillRect(210, 110, 80, 20);
          context.fillRect(360, 80, 70, 60);
          context.fillRect(60, 160, 100, 30);
          context.fillRect(310, 170, 130, 50);
        }
        
        const fallbackTexture = new THREE.CanvasTexture(canvas);
        setTexture(fallbackTexture);
      }
    );

    if (meshRef.current) {
      console.log('Mesh position:', meshRef.current.position);
      console.log('Mesh visible:', meshRef.current.visible);
    }
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      <sphereGeometry args={[2, 64, 32]} />
      <meshPhongMaterial 
        map={texture} 
        color="#ffffff"
        shininess={30}
      />
    </mesh>
  );
}

// Fallback component
function FallbackEarth() {
  console.log('Fallback Earth component rendered');
  return (
    <div className="w-full h-full bg-black flex items-center justify-center relative">
      {/* Stars background */}
      <div className="absolute inset-0 bg-black">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      <div className="w-64 h-64 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
        {/* Continents simulation */}
        <div className="absolute inset-0 rounded-full">
          <div className="absolute top-8 left-12 w-16 h-12 bg-green-600 rounded-lg opacity-80"></div>
          <div className="absolute top-20 right-8 w-20 h-16 bg-yellow-700 rounded-xl opacity-70"></div>
          <div className="absolute bottom-16 left-8 w-24 h-20 bg-orange-600 rounded-2xl opacity-75"></div>
          <div className="absolute bottom-8 right-12 w-18 h-14 bg-red-700 rounded-lg opacity-65"></div>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-purple-600 rounded-md opacity-70"></div>
        </div>
        <div className="text-white text-2xl opacity-50">🌍</div>
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
    
    // Set black background for space
    state.scene.background = new THREE.Color(0x000000);
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
      <div className="relative z-10 h-[calc(100vh-200px)] bg-black">
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
            {/* Stars background */}
            <Stars />
            
            {/* Lighting for Earth */}
            <ambientLight intensity={0.3} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={1.2}
              color="#ffffff"
            />
            <pointLight 
              position={[-5, -5, -5]} 
              intensity={0.5}
              color="#4A90E2"
            />
            
            {/* Earth with texture */}
            <Earth />
            
            {/* Controls */}
            <OrbitControls 
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={true}
              autoRotateSpeed={0.5}
              minDistance={3}
              maxDistance={15}
              enablePan={false}
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
