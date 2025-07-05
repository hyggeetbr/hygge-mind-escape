
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
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

// Earth component with clickable country flag buttons
function Earth({ onCountryClick }: { onCountryClick: (country: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current) {
      // Get camera position
      const cameraPosition = camera.position.clone();
      
      // Light source position (directional light is at [5, 3, 5])
      const lightPosition = new THREE.Vector3(5, 3, 5);
      
      // Calculate if the camera is on the same side as the light source
      // We check the dot product of normalized vectors from Earth center
      const cameraDirection = cameraPosition.clone().normalize();
      const lightDirection = lightPosition.clone().normalize();
      
      // If dot product is positive, camera and light are on the same side
      const dotProduct = cameraDirection.dot(lightDirection);
      
      // Show buttons only when camera is viewing the bright side
      setButtonsVisible(dotProduct > 0.1);
    }
  });

  const handleCountryClick = (country: string) => {
    console.log(`${country} button clicked`);
    onCountryClick(country);
  };

  // Flag emojis for each country
  const countryFlags = {
    China: "🇨🇳",
    India: "🇮🇳", 
    Japan: "🇯🇵",
    Greece: "🇬🇷",
    Russia: "🇷🇺",
    Scandinavia: "🇸🇪" // Using Sweden flag to represent Scandinavia
  };

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 64, 32]} />
        <meshPhongMaterial 
          color="#1565c0"
          shininess={10}
          specular="#444444"
        />
      </mesh>

      {/* Country flag buttons - only visible when on bright side */}
      {buttonsVisible && (
        <>
          {/* China */}
          <Html position={[1.8, 0.8, 1.2]} distanceFactor={8}>
            <button
              onClick={() => handleCountryClick('China')}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110"
              title="China"
            >
              {countryFlags.China}
            </button>
          </Html>

          {/* India */}
          <Html position={[1.2, -0.5, 2]} distanceFactor={8}>
            <button
              onClick={() => handleCountryClick('India')}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110"
              title="India"
            >
              {countryFlags.India}
            </button>
          </Html>

          {/* Japan */}
          <Html position={[2.2, 0.2, 0.8]} distanceFactor={8}>
            <button
              onClick={() => handleCountryClick('Japan')}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110"
              title="Japan"
            >
              {countryFlags.Japan}
            </button>
          </Html>

          {/* Greece */}
          <Html position={[0.8, 1.2, 1.8]} distanceFactor={8}>
            <button
              onClick={() => handleCountryClick('Greece')}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110"
              title="Greece"
            >
              {countryFlags.Greece}
            </button>
          </Html>

          {/* Russia */}
          <Html position={[2.0, 1.5, 0.5]} distanceFactor={8}>
            <button
              onClick={() => handleCountryClick('Russia')}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110"
              title="Russia"
            >
              {countryFlags.Russia}
            </button>
          </Html>

          {/* Scandinavia */}
          <Html position={[0.5, 1.8, 1.0]} distanceFactor={8}>
            <button
              onClick={() => handleCountryClick('Scandinavia')}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110"
              title="Scandinavia"
            >
              {countryFlags.Scandinavia}
            </button>
          </Html>
        </>
      )}
    </group>
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
          Click on the flag icons to explore folklore from different countries
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
