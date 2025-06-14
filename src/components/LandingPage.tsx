
import { useState } from "react";

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage = ({ onEnterApp }: LandingPageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-hygge-sage/20 rounded-full blur-xl animate-pulse-soft"></div>
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-hygge-stone/30 rounded-full blur-lg animate-float"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-hygge-sky/25 rounded-full blur-md animate-pulse-soft delay-1000"></div>
      
      {/* Main content */}
      <div className="text-center z-10 animate-fade-in">
        <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold mb-8 text-gradient">
          Hygge
        </h1>
        
        <p className="text-hygge-earth/80 text-lg md:text-xl mb-16 font-light max-w-md mx-auto leading-relaxed">
          Find peace in the digital chaos. Meditate, move mindfully, and rediscover meaningful content.
        </p>
        
        {/* Floating bubble with tagline */}
        <div className="relative flex justify-center">
          <button
            onClick={onEnterApp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              relative bg-gradient-to-br from-hygge-sage to-hygge-moss 
              text-hygge-cream font-medium px-8 py-4 rounded-full 
              animate-float bubble-glow
              transition-all duration-300 ease-out
              hover:scale-110 hover:shadow-lg
              ${isHovered ? 'animate-pulse-soft' : ''}
            `}
          >
            <span className="relative z-10 text-lg md:text-xl">
              Escape the Brainrot
            </span>
            
            {/* Ripple effect on hover */}
            {isHovered && (
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
            )}
          </button>
        </div>
        
        {/* Subtle call to action */}
        <p className="text-hygge-moss/60 text-sm mt-8 animate-fade-in delay-500">
          Click the bubble to begin your journey
        </p>
      </div>
      
      {/* Bottom decorative text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-hygge-stone/60 text-sm font-light">
        Your mindful companion
      </div>
    </div>
  );
};

export default LandingPage;
