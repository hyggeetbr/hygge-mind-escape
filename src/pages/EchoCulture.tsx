
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

// Earth component with India, China, and Japan
function Earth({ onCountryClick }: { onCountryClick: (country: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isTextureReady, setIsTextureReady] = useState(false);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    console.log('Creating Earth texture with India, China, and Japan...');
    
    const createEarthTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Deep ocean blue background
      ctx.fillStyle = '#1565c0';
      ctx.fillRect(0, 0, 2048, 1024);
      
      // Ocean depth variations
      const oceanGradient = ctx.createRadialGradient(1024, 512, 0, 1024, 512, 800);
      oceanGradient.addColorStop(0, '#2196f3');
      oceanGradient.addColorStop(1, '#0d47a1');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, 2048, 1024);
      
      // India (South Asia)
      ctx.fillStyle = '#4caf50';
      ctx.beginPath();
      ctx.moveTo(1300, 350);
      ctx.quadraticCurveTo(1350, 340, 1380, 370);
      ctx.quadraticCurveTo(1400, 420, 1370, 480);
      ctx.quadraticCurveTo(1340, 520, 1300, 500);
      ctx.quadraticCurveTo(1280, 460, 1290, 400);
      ctx.quadraticCurveTo(1285, 370, 1300, 350);
      ctx.fill();
      
      // China (East Asia)
      ctx.fillStyle = '#ff9800';
      ctx.beginPath();
      ctx.moveTo(1450, 250);
      ctx.quadraticCurveTo(1550, 240, 1600, 280);
      ctx.quadraticCurveTo(1620, 320, 1590, 360);
      ctx.quadraticCurveTo(1540, 380, 1480, 370);
      ctx.quadraticCurveTo(1430, 340, 1440, 290);
      ctx.quadraticCurveTo(1435, 260, 1450, 250);
      ctx.fill();
      
      // Japan (Island nation east of China)
      ctx.fillStyle = '#e91e63';
      ctx.beginPath();
      ctx.ellipse(1650, 300, 25, 60, Math.PI / 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Small Japanese islands
      ctx.beginPath();
      ctx.ellipse(1670, 280, 8, 15, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(1635, 330, 12, 20, -Math.PI / 8, 0, 2 * Math.PI);
      ctx.fill();
      
      console.log('Earth texture created successfully with three countries');
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      
      return texture;
    };

    const texture = createEarthTexture();
    if (texture) {
      setEarthTexture(texture);
      setIsTextureReady(true);
      console.log('Earth texture is ready');
    }
  }, []);

  const handleClick = (event: any) => {
    if (!meshRef.current) return;
    
    // Convert mouse position to normalized device coordinates
    const rect = event.target.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Get camera from the scene
    const camera = event.target.parentElement?.camera || event.camera;
    if (!camera) return;
    
    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObject(meshRef.current);
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const uv = intersection.uv;
      
      if (uv) {
        // Convert UV coordinates to texture coordinates
        const x = uv.x * 2048;
        const y = (1 - uv.y) * 1024;
        
        console.log('Clicked at texture coordinates:', x, y);
        
        // Check which country was clicked based on texture coordinates
        // India region
        if (x >= 1280 && x <= 1400 && y >= 340 && y <= 520) {
          console.log('India clicked');
          onCountryClick('India');
        }
        // China region
        else if (x >= 1430 && x <= 1620 && y >= 240 && y <= 380) {
          console.log('China clicked');
          onCountryClick('China');
        }
        // Japan region
        else if (x >= 1610 && x <= 1690 && y >= 240 && y <= 360) {
          console.log('Japan clicked');
          onCountryClick('Japan');
        }
      }
    }
  };

  if (!isTextureReady || !earthTexture) {
    return null;
  }

  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, 0]} 
      onClick={handleClick}
      onPointerOver={(e) => {
        e.target.style.cursor = 'pointer';
      }}
    >
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

  const handleCountryClick = (country: string) => {
    navigate(`/folklore/${country.toLowerCase()}`);
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
          Click on India, China, or Japan to explore their folklore
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
          <Stars />
          
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
          
          <Earth onCountryClick={handleCountryClick} />
          
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
