
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

// Earth component with reliable texture
function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    console.log('Starting Earth texture loading...');
    
    // Create a detailed procedural Earth texture immediately
    const createDetailedEarthTexture = () => {
      console.log('Creating detailed procedural Earth texture...');
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Ocean base with gradient
        const oceanGradient = context.createLinearGradient(0, 0, 0, 1024);
        oceanGradient.addColorStop(0, '#1e3a8a');  // Deep blue at poles
        oceanGradient.addColorStop(0.5, '#0ea5e9'); // Lighter blue at equator
        oceanGradient.addColorStop(1, '#1e3a8a');   // Deep blue at poles
        
        context.fillStyle = oceanGradient;
        context.fillRect(0, 0, 2048, 1024);
        
        // Add realistic continents with proper colors
        context.fillStyle = '#8b5a3c'; // Brown for land base
        
        // North America (more detailed)
        context.beginPath();
        context.moveTo(300, 200);
        context.quadraticCurveTo(250, 150, 400, 180);
        context.quadraticCurveTo(450, 200, 420, 280);
        context.quadraticCurveTo(380, 320, 320, 300);
        context.quadraticCurveTo(280, 250, 300, 200);
        context.fill();
        
        // South America
        context.beginPath();
        context.ellipse(380, 450, 60, 120, 0.2, 0, 2 * Math.PI);
        context.fill();
        
        // Europe
        context.beginPath();
        context.ellipse(1100, 180, 40, 30, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Africa
        context.beginPath();
        context.moveTo(1050, 250);
        context.quadraticCurveTo(1120, 280, 1100, 400);
        context.quadraticCurveTo(1080, 500, 1020, 480);
        context.quadraticCurveTo(1000, 350, 1050, 250);
        context.fill();
        
        // Asia (larger and more detailed)
        context.beginPath();
        context.moveTo(1200, 150);
        context.quadraticCurveTo(1400, 120, 1600, 180);
        context.quadraticCurveTo(1650, 250, 1580, 300);
        context.quadraticCurveTo(1400, 280, 1200, 150);
        context.fill();
        
        // Australia
        context.beginPath();
        context.ellipse(1650, 550, 80, 50, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add green vegetation areas
        context.fillStyle = '#22c55e';
        
        // Amazon rainforest
        context.beginPath();
        context.ellipse(360, 420, 30, 60, 0, 0, 2 * Math.PI);
        context.fill();
        
        // North American forests
        context.beginPath();
        context.ellipse(350, 220, 40, 25, 0, 0, 2 * Math.PI);
        context.fill();
        
        // African vegetation
        context.beginPath();
        context.ellipse(1070, 350, 25, 40, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Asian forests
        context.beginPath();
        context.ellipse(1450, 200, 60, 30, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add deserts (sandy color)
        context.fillStyle = '#f4a460';
        
        // Sahara Desert
        context.beginPath();
        context.ellipse(1080, 280, 50, 20, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Arabian Desert
        context.beginPath();
        context.ellipse(1200, 300, 30, 15, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add ice caps
        context.fillStyle = '#f8fafc';
        
        // Arctic ice cap
        context.beginPath();
        context.ellipse(1024, 80, 800, 60, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Antarctic ice cap
        context.beginPath();
        context.ellipse(1024, 944, 800, 60, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add mountain ranges (darker brown)
        context.fillStyle = '#654321';
        
        // Rocky Mountains
        context.beginPath();
        context.ellipse(320, 240, 8, 40, 0.3, 0, 2 * Math.PI);
        context.fill();
        
        // Andes Mountains
        context.beginPath();
        context.ellipse(370, 450, 6, 100, 0.1, 0, 2 * Math.PI);
        context.fill();
        
        // Himalayas
        context.beginPath();
        context.ellipse(1400, 240, 80, 8, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Add subtle cloud patterns
        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * 2048;
          const y = Math.random() * 1024;
          const width = 40 + Math.random() * 80;
          const height = width * 0.4;
          
          context.beginPath();
          context.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
          context.fill();
        }
      }
      
      const earthTexture = new THREE.CanvasTexture(canvas);
      earthTexture.wrapS = THREE.RepeatWrapping;
      earthTexture.wrapT = THREE.RepeatWrapping;
      console.log('Detailed Earth texture created successfully');
      return earthTexture;
    };

    // Set the texture immediately
    const earthTexture = createDetailedEarthTexture();
    setTexture(earthTexture);

    // Try to load a real Earth texture as backup
    const loader = new THREE.TextureLoader();
    
    // High-quality Earth texture URLs
    const textureUrls = [
      'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
    ];

    let currentUrlIndex = 0;
    
    const tryLoadTexture = () => {
      if (currentUrlIndex >= textureUrls.length) {
        console.log('All texture URLs failed, using procedural texture');
        return;
      }

      const url = textureUrls[currentUrlIndex];
      console.log(`Attempting to load Earth texture from: ${url}`);
      
      loader.load(
        url,
        (loadedTexture) => {
          console.log('Real Earth texture loaded successfully!');
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.wrapT = THREE.RepeatWrapping;
          setTexture(loadedTexture);
        },
        (progress) => {
          console.log(`Loading progress: ${Math.round((progress.loaded / progress.total) * 100)}%`);
        },
        (error) => {
          console.warn(`Failed to load texture from ${url}:`, error);
          currentUrlIndex++;
          tryLoadTexture();
        }
      );
    };

    // Start loading real texture
    tryLoadTexture();

  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.5, 64, 32]} />
      <meshPhongMaterial 
        map={texture}
        color="#ffffff"
        shininess={30}
        specular="#111111"
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
