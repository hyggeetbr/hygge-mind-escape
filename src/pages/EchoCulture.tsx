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

// Earth component with accurate India, China, and Japan shapes
function Earth({ onCountryClick }: { onCountryClick: (country: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isTextureReady, setIsTextureReady] = useState(false);
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    console.log('Creating Earth texture with accurate India, China, and Japan shapes...');
    
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
      
      // Position countries on the bright side (center-right area of texture)
      // China - Orange landmass with accurate shape
      ctx.fillStyle = '#ff9800';
      ctx.beginPath();
      // Main body of China - roughly rectangular with curves
      ctx.moveTo(1200, 200);
      ctx.quadraticCurveTo(1300, 180, 1400, 200);
      ctx.quadraticCurveTo(1450, 220, 1480, 260);
      ctx.quadraticCurveTo(1490, 300, 1470, 340);
      ctx.quadraticCurveTo(1450, 380, 1400, 400);
      ctx.quadraticCurveTo(1350, 420, 1300, 410);
      ctx.quadraticCurveTo(1250, 400, 1200, 380);
      ctx.quadraticCurveTo(1150, 360, 1140, 320);
      ctx.quadraticCurveTo(1130, 280, 1150, 240);
      ctx.quadraticCurveTo(1170, 210, 1200, 200);
      ctx.fill();
      
      // Western extension of China
      ctx.beginPath();
      ctx.moveTo(1100, 280);
      ctx.quadraticCurveTo(1080, 290, 1070, 310);
      ctx.quadraticCurveTo(1080, 330, 1100, 320);
      ctx.quadraticCurveTo(1120, 310, 1130, 290);
      ctx.quadraticCurveTo(1120, 280, 1100, 280);
      ctx.fill();
      
      // India - Green landmass with triangular peninsula shape
      ctx.fillStyle = '#4caf50';
      ctx.beginPath();
      // Northern part (wider)
      ctx.moveTo(1150, 450);
      ctx.quadraticCurveTo(1200, 440, 1250, 450);
      ctx.quadraticCurveTo(1280, 460, 1290, 480);
      ctx.quadraticCurveTo(1285, 500, 1270, 520);
      // Eastern coast
      ctx.quadraticCurveTo(1260, 540, 1250, 580);
      ctx.quadraticCurveTo(1240, 620, 1220, 650);
      // Southern tip (triangular)
      ctx.quadraticCurveTo(1200, 680, 1170, 685);
      ctx.quadraticCurveTo(1140, 680, 1120, 650);
      // Western coast
      ctx.quadraticCurveTo(1110, 620, 1105, 580);
      ctx.quadraticCurveTo(1100, 540, 1110, 500);
      ctx.quadraticCurveTo(1120, 470, 1150, 450);
      ctx.fill();
      
      // Sri Lanka (small island below India)
      ctx.beginPath();
      ctx.ellipse(1160, 700, 8, 12, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Japan - Pink landmass with island chain shape
      ctx.fillStyle = '#e91e63';
      // Main island (Honshu) - elongated curve
      ctx.beginPath();
      ctx.moveTo(1550, 280);
      ctx.quadraticCurveTo(1580, 270, 1600, 290);
      ctx.quadraticCurveTo(1620, 310, 1630, 340);
      ctx.quadraticCurveTo(1625, 370, 1610, 390);
      ctx.quadraticCurveTo(1590, 400, 1570, 395);
      ctx.quadraticCurveTo(1550, 390, 1540, 370);
      ctx.quadraticCurveTo(1535, 340, 1540, 310);
      ctx.quadraticCurveTo(1545, 290, 1550, 280);
      ctx.fill();
      
      // Hokkaido (northern island)
      ctx.beginPath();
      ctx.ellipse(1570, 250, 15, 20, Math.PI / 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Kyushu (southern island)
      ctx.beginPath();
      ctx.ellipse(1580, 420, 12, 18, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Shikoku (smaller southern island)
      ctx.beginPath();
      ctx.ellipse(1600, 400, 8, 12, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      console.log('Earth texture created successfully with accurate country shapes');
      
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
        
        // Check which country was clicked based on updated texture coordinates
        // China region (updated coordinates)
        if (x >= 1070 && x <= 1490 && y >= 180 && y <= 420) {
          console.log('China clicked');
          onCountryClick('China');
        }
        // India region (updated coordinates)
        else if (x >= 1100 && x <= 1290 && y >= 440 && y <= 700) {
          console.log('India clicked');
          onCountryClick('India');
        }
        // Japan region (updated coordinates)
        else if (x >= 1535 && x <= 1640 && y >= 240 && y <= 430) {
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
