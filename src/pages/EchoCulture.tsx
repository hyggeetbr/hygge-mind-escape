
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

// Earth component with guaranteed realistic texture
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    console.log('Creating guaranteed Earth texture...');
    
    const createRealisticEarthTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 4096;  // Higher resolution
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      console.log('Drawing realistic Earth texture...');
      
      // Deep ocean blue background
      ctx.fillStyle = '#1a237e';  // Deep ocean blue
      ctx.fillRect(0, 0, 4096, 2048);
      
      // Add ocean depth variations
      const oceanGradient = ctx.createRadialGradient(2048, 1024, 0, 2048, 1024, 1500);
      oceanGradient.addColorStop(0, '#2196f3');  // Lighter blue in center
      oceanGradient.addColorStop(1, '#0d47a1');  // Darker blue at edges
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, 4096, 2048);
      
      // North America - detailed shape
      ctx.fillStyle = '#4a5d23';  // Dark green for land
      ctx.beginPath();
      ctx.moveTo(600, 400);  // Canada
      ctx.quadraticCurveTo(500, 300, 700, 350);
      ctx.quadraticCurveTo(900, 380, 850, 550);  // USA
      ctx.quadraticCurveTo(750, 650, 700, 600);
      ctx.quadraticCurveTo(650, 500, 600, 400);
      ctx.fill();
      
      // Add forests to North America
      ctx.fillStyle = '#2e7d32';  // Forest green
      ctx.beginPath();
      ctx.ellipse(720, 420, 60, 40, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // South America
      ctx.fillStyle = '#4a5d23';
      ctx.beginPath();
      ctx.moveTo(750, 700);
      ctx.quadraticCurveTo(800, 650, 780, 800);
      ctx.quadraticCurveTo(760, 1000, 720, 1200);
      ctx.quadraticCurveTo(700, 1100, 730, 900);
      ctx.quadraticCurveTo(720, 750, 750, 700);
      ctx.fill();
      
      // Amazon rainforest
      ctx.fillStyle = '#1b5e20';  // Dark forest green
      ctx.beginPath();
      ctx.ellipse(760, 850, 50, 80, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Europe
      ctx.fillStyle = '#4a5d23';
      ctx.beginPath();
      ctx.ellipse(2200, 350, 80, 60, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Africa - detailed shape
      ctx.fillStyle = '#8d6e63';  // Brown for Africa
      ctx.beginPath();
      ctx.moveTo(2100, 500);
      ctx.quadraticCurveTo(2200, 480, 2250, 600);
      ctx.quadraticCurveTo(2280, 800, 2200, 1000);
      ctx.quadraticCurveTo(2150, 1100, 2050, 1000);
      ctx.quadraticCurveTo(2000, 700, 2100, 500);
      ctx.fill();
      
      // Sahara Desert
      ctx.fillStyle = '#ffa726';  // Sandy color
      ctx.beginPath();
      ctx.ellipse(2150, 550, 100, 40, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Central African forests
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.ellipse(2150, 750, 70, 50, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Asia - large and detailed
      ctx.fillStyle = '#4a5d23';
      ctx.beginPath();
      ctx.moveTo(2400, 300);
      ctx.quadraticCurveTo(2800, 250, 3200, 320);
      ctx.quadraticCurveTo(3400, 400, 3300, 600);
      ctx.quadraticCurveTo(2900, 650, 2500, 550);
      ctx.quadraticCurveTo(2350, 400, 2400, 300);
      ctx.fill();
      
      // Siberian forests
      ctx.fillStyle = '#1b5e20';
      ctx.beginPath();
      ctx.ellipse(2800, 350, 200, 50, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Himalayas (snow-capped mountains)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(2700, 500, 150, 20, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // India
      ctx.fillStyle = '#8d6e63';
      ctx.beginPath();
      ctx.moveTo(2600, 600);
      ctx.quadraticCurveTo(2700, 580, 2750, 700);
      ctx.quadraticCurveTo(2700, 800, 2600, 750);
      ctx.quadraticCurveTo(2550, 650, 2600, 600);
      ctx.fill();
      
      // China
      ctx.fillStyle = '#6d4c41';
      ctx.beginPath();
      ctx.ellipse(2900, 450, 120, 80, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Australia
      ctx.fillStyle = '#d7ccc8';  // Light brown/beige
      ctx.beginPath();
      ctx.ellipse(3300, 1200, 120, 80, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Australian Outback (red center)
      ctx.fillStyle = '#bf360c';
      ctx.beginPath();
      ctx.ellipse(3300, 1200, 60, 40, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Greenland
      ctx.fillStyle = '#f5f5f5';  // Icy white
      ctx.beginPath();
      ctx.ellipse(1000, 200, 80, 60, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Antarctica (bottom)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 1800, 4096, 248);
      
      // Arctic ice cap (top)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 4096, 120);
      
      // Add some cloud cover for realism
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 4096;
        const y = Math.random() * 2048;
        const width = 80 + Math.random() * 120;
        const height = width * 0.4;
        
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      console.log('Earth texture created successfully with realistic colors');
      
      const earthTexture = new THREE.CanvasTexture(canvas);
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.wrapT = THREE.RepeatWrapping;
      earthTexture.minFilter = THREE.LinearFilter;
      earthTexture.magFilter = THREE.LinearFilter;
      
      return earthTexture;
    };

    const earthTexture = createRealisticEarthTexture();
    if (earthTexture) {
      setTexture(earthTexture);
      console.log('Earth texture set successfully');
    }

  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 32]} />
      <meshPhongMaterial 
        map={texture}
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
