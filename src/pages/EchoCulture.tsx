
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

// Earth component with proper texture
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    console.log('Loading Earth texture...');
    
    const loader = new THREE.TextureLoader();
    
    // Try multiple Earth texture sources
    const textureUrls = [
      'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
      'https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/5/56/Blue_Marble_Next_Generation_%2B_topography_%2B_bathymetry.jpg'
    ];

    let textureLoaded = false;

    const tryLoadTexture = (urlIndex: number) => {
      if (urlIndex >= textureUrls.length || textureLoaded) {
        // If all URLs fail, create a realistic fallback
        createFallbackTexture();
        return;
      }

      loader.load(
        textureUrls[urlIndex],
        (loadedTexture) => {
          if (!textureLoaded) {
            console.log(`Earth texture loaded successfully from source ${urlIndex + 1}`);
            textureLoaded = true;
            loadedTexture.wrapS = THREE.RepeatWrapping;
            loadedTexture.wrapT = THREE.RepeatWrapping;
            setTexture(loadedTexture);
          }
        },
        (progress) => {
          console.log(`Loading texture ${urlIndex + 1}:`, progress);
        },
        (error) => {
          console.warn(`Failed to load texture ${urlIndex + 1}:`, error);
          // Try next URL
          tryLoadTexture(urlIndex + 1);
        }
      );
    };

    const createFallbackTexture = () => {
      console.log('Creating fallback Earth texture...');
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Create ocean base
        const oceanGradient = context.createRadialGradient(512, 256, 0, 512, 256, 512);
        oceanGradient.addColorStop(0, '#4A90E2');
        oceanGradient.addColorStop(0.5, '#2E86C1');
        oceanGradient.addColorStop(1, '#1B4F72');
        
        context.fillStyle = oceanGradient;
        context.fillRect(0, 0, 1024, 512);
        
        // Add continents with realistic shapes and colors
        context.fillStyle = '#8D6E63'; // Brown for land
        
        // North America
        context.beginPath();
        context.ellipse(200, 150, 80, 60, 0, 0, 2 * Math.PI);
        context.fill();
        
        // South America
        context.beginPath();
        context.ellipse(250, 280, 40, 80, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Europe
        context.beginPath();
        context.ellipse(480, 120, 30, 25, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Africa
        context.beginPath();
        context.ellipse(520, 220, 50, 90, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Asia
        context.beginPath();
        context.ellipse(700, 150, 120, 70, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Australia
        context.beginPath();
        context.ellipse(800, 320, 60, 40, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add green vegetation on continents
        context.fillStyle = '#4CAF50';
        
        // Green areas on North America
        context.beginPath();
        context.ellipse(180, 140, 30, 20, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Green areas on South America
        context.beginPath();
        context.ellipse(240, 260, 20, 40, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Green areas on Africa
        context.beginPath();
        context.ellipse(510, 200, 25, 30, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Green areas on Asia
        context.beginPath();
        context.ellipse(680, 140, 40, 25, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add ice caps
        context.fillStyle = '#E8F4FD';
        context.beginPath();
        context.ellipse(512, 50, 200, 30, 0, 0, 2 * Math.PI);
        context.fill();
        
        context.beginPath();
        context.ellipse(512, 462, 200, 30, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add some cloud-like patterns
        context.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * 1024;
          const y = Math.random() * 512;
          const radius = 20 + Math.random() * 40;
          context.beginPath();
          context.ellipse(x, y, radius, radius * 0.6, 0, 0, 2 * Math.PI);
          context.fill();
        }
      }
      
      const fallbackTexture = new THREE.CanvasTexture(canvas);
      fallbackTexture.wrapS = THREE.RepeatWrapping;
      fallbackTexture.wrapT = THREE.RepeatWrapping;
      setTexture(fallbackTexture);
    };

    // Start loading textures
    tryLoadTexture(0);

  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 32]} />
      <meshPhongMaterial 
        map={texture} 
        color="#ffffff"
        shininess={100}
        specular="#222222"
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
          
          {/* Realistic lighting setup */}
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight 
            position={[5, 3, 5]} 
            intensity={1}
            color="#ffffff"
            castShadow
          />
          <pointLight 
            position={[-5, -3, -5]} 
            intensity={0.3}
            color="#4A90E2"
          />
          
          {/* Earth with realistic texture */}
          <Earth />
          
          {/* Enhanced orbit controls */}
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={true}
            autoRotateSpeed={0.8}
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
