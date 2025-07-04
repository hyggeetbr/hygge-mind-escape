
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
      const positions = new Float32Array(2000 * 3);
      for (let i = 0; i < 2000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      }
      starsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial color="white" size={1} sizeAttenuation={false} />
    </points>
  );
}

// Earth component with guaranteed texture loading
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isTextureReady, setIsTextureReady] = useState(false);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    console.log('Creating Earth texture synchronously...');
    
    const createEarthTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Deep ocean blue background
      ctx.fillStyle = '#1a237e';
      ctx.fillRect(0, 0, 2048, 1024);
      
      // Ocean depth variations
      const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 800);
      oceanGradient.addColorStop(0, '#2196f3');
      oceanGradient.addColorStop(1, '#0d47a1');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, 2048, 1024);
      
      // North America
      ctx.fillStyle = '#4a5d23';
      ctx.beginPath();
      ctx.moveTo(300, 200);
      ctx.quadraticCurveTo(250, 150, 350, 175);
      ctx.quadraticCurveTo(450, 190, 425, 275);
      ctx.quadraticCurveTo(375, 325, 350, 300);
      ctx.quadraticCurveTo(325, 250, 300, 200);
      ctx.fill();
      
      // South America
      ctx.fillStyle = '#4a5d23';
      ctx.beginPath();
      ctx.moveTo(375, 350);
      ctx.quadraticCurveTo(400, 325, 390, 400);
      ctx.quadraticCurveTo(380, 500, 360, 600);
      ctx.quadraticCurveTo(350, 550, 365, 450);
      ctx.quadraticCurveTo(360, 375, 375, 350);
      ctx.fill();
      
      // Amazon rainforest
      ctx.fillStyle = '#1b5e20';
      ctx.beginPath();
      ctx.ellipse(380, 425, 25, 40, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Europe
      ctx.fillStyle = '#4a5d23';
      ctx.beginPath();
      ctx.ellipse(1100, 175, 40, 30, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Africa
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath();
      ctx.moveTo(1050, 250);
      ctx.quadraticCurveTo(1100, 240, 1125, 300);
      ctx.quadraticCurveTo(1140, 400, 1100, 500);
      ctx.quadraticCurveTo(1075, 550, 1025, 500);
      ctx.quadraticCurveTo(1000, 350, 1050, 250);
      ctx.fill();
      
      // Sahara Desert
      ctx.fillStyle = '#ffa726';
      ctx.beginPath();
      ctx.ellipse(1075, 275, 50, 20, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Asia
      ctx.fillStyle = '#4a5d23';
      ctx.beginPath();
      ctx.moveTo(1200, 150);
      ctx.quadraticCurveTo(1400, 125, 1600, 160);
      ctx.quadraticCurveTo(1700, 200, 1650, 300);
      ctx.quadraticCurveTo(1450, 325, 1250, 275);
      ctx.quadraticCurveTo(1175, 200, 1200, 150);
      ctx.fill();
      
      // China
      ctx.fillStyle = '#6d4c41';
      ctx.beginPath();
      ctx.ellipse(1450, 225, 60, 40, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Australia
      ctx.fillStyle = '#d7ccc8';
      ctx.beginPath();
      ctx.ellipse(1650, 600, 60, 40, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Greenland
      ctx.fillStyle = '#f5f5f5';
      ctx.beginPath();
      ctx.ellipse(500, 100, 40, 30, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Antarctica
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 900, 2048, 124);
      
      // Arctic
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 2048, 60);
      
      // Cloud cover
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const width = 40 + Math.random() * 60;
        const height = width * 0.4;
        
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      console.log('Earth texture created successfully');
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      
      return texture;
    };

    // Create texture synchronously
    const texture = createEarthTexture();
    if (texture) {
      setEarthTexture(texture);
      setIsTextureReady(true);
      console.log('Earth texture is ready');
    }
  }, []);

  // Don't render until texture is ready
  if (!isTextureReady || !earthTexture) {
    return null;
  }

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 32]} />
      <meshPhongMaterial 
        map={earthTexture}
        color="#ffffff"
        shininess={10}
        specular="#444444"
      />
    </mesh>
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
      <div className="relative z-10 h-[calc(100vh-200px)] bg-black">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          onCreated={(state) => {
            console.log('Canvas created successfully');
            state.scene.background = new THREE.Color(0x000000);
          }}
        >
          {/* Starfield background */}
          <Stars />
          
          {/* Lighting setup */}
          <ambientLight intensity={0.3} color="#ffffff" />
          <directionalLight 
            position={[5, 3, 5]} 
            intensity={1.2}
            color="#ffffff"
          />
          <pointLight 
            position={[-5, -3, -5]} 
            intensity={0.4}
            color="#4A90E2"
          />
          
          {/* Earth */}
          <Earth />
          
          {/* Controls */}
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minDistance={4}
            maxDistance={12}
            enablePan={false}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
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
