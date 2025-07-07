import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import ThemeSelector from "@/components/ThemeSelector";

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

  // Create procedural ocean texture
  useEffect(() => {
    if (meshRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Create ocean gradient
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#1a237e'); // Deep ocean blue
        gradient.addColorStop(0.3, '#1565c0'); // Medium blue
        gradient.addColorStop(0.7, '#2196f3'); // Light blue
        gradient.addColorStop(1, '#64b5f6'); // Shallow water
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 256);
        
        // Add some noise for ocean variation
        const imageData = context.getImageData(0, 0, 512, 256);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 30;
          data[i] = Math.max(0, Math.min(255, data[i] + noise)); // R
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
        }
        
        context.putImageData(imageData, 0, 0);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        // Update material with new texture
        const material = meshRef.current.material as THREE.MeshPhongMaterial;
        material.map = texture;
        material.needsUpdate = true;
      }
    }
  }, []);

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
    Scandinavia: "🇳🇴" // Using Norway flag to better represent Scandinavia
  };

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 64, 32]} />
        <meshPhongMaterial 
          color="#1565c0"
          shininess={30}
          specular="#888888"
          transparent={true}
          opacity={0.95}
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
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 shadow-lg cursor-pointer hover:bg-gray-100 flex items-center justify-center overflow-hidden transition-all hover:scale-110"
              title="Scandinavia"
            >
              <img 
                src="/lovable-uploads/54893b32-0cc6-40fc-abd3-9b5d1ab4438d.png" 
                alt="Scandinavian flag"
                className="w-full h-full object-cover"
              />
            </button>
          </Html>
        </>
      )}
    </group>
  );
}

const EchoCulture = () => {
  const navigate = useNavigate();
  const [currentBackground, setCurrentBackground] = useState("url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')");

  const handleCountryClick = (country: string) => {
    navigate(`/folklore/${country.toLowerCase()}`);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: currentBackground,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-botanical-lavender/30 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-botanical-sage/25 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-botanical-cream/40 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/discover")}
          className="text-botanical-text-dark hover:bg-white/20 hover:text-botanical-text-dark"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-botanical-text-dark text-xl font-medium">Echo Culture</h1>
        <div className="w-10"></div>
      </div>

      {/* Instructions */}
      <div className="relative z-20 px-6 mb-4">
        <p className="text-botanical-text-medium text-center text-sm">
          Click on the flag icons to explore folklore from different countries
        </p>
      </div>

      {/* 3D Earth Canvas */}
      <div className="relative z-10 h-[calc(100vh-200px)] bg-transparent">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          onCreated={(state) => {
            console.log('Canvas created successfully');
            state.scene.background = null; // Remove black background to show botanical theme
          }}
        >
          <Stars />
          
          <ambientLight intensity={0.2} color="#ffffff" />
          <directionalLight 
            position={[5, 3, 5]} 
            intensity={1.5}
            color="#ffffff"
            castShadow
          />
          <pointLight 
            position={[-5, -3, -5]} 
            intensity={0.3}
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-botanical-purple/30 z-50">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Home className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 bg-botanical-purple rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-botanical-text-dark text-xs font-medium">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Users className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Bot className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Lumina</span>
          </div>
        </div>
      </div>

      <ThemeSelector onThemeChange={setCurrentBackground} />
    </div>
  );
};

export default EchoCulture;
