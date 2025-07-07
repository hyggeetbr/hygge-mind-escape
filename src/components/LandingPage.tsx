
import { useState } from "react";

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage = ({ onEnterApp }: LandingPageProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-botanical-lavender/30 rounded-full blur-xl animate-pulse-soft"></div>
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-botanical-sage/25 rounded-full blur-lg"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-botanical-cream/40 rounded-full blur-md animate-pulse-soft delay-1000"></div>
      
      {/* Main content */}
      <div className="text-center z-10 animate-fade-in">
        <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold mb-8 text-botanical-text-dark">
          Hygge
        </h1>
        
        <p className="text-botanical-text-medium text-lg md:text-xl mb-16 font-light max-w-md mx-auto leading-relaxed">
          Find peace in the digital chaos. Meditate, move mindfully, and rediscover meaningful content.
        </p>
        
        {/* Circular transparent bubble */}
        <div className="relative flex justify-center">
          <button
            onClick={onEnterApp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
              relative w-48 h-48 
              bg-gradient-to-br from-white/80 to-white/60 
              backdrop-blur-sm border border-botanical-purple/30
              text-botanical-text-dark font-medium
              rounded-full 
              transition-all duration-300 ease-out
              hover:scale-110 hover:shadow-xl hover:shadow-botanical-purple/20
              flex items-center justify-center
              ${isHovered ? 'animate-pulse-soft' : ''}
            `}
            style={{
              boxShadow: `
                0 8px 32px rgba(139, 118, 147, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.5),
                inset 0 -1px 0 rgba(139, 118, 147, 0.1)
              `
            }}
          >
            <span className="relative z-10 text-lg md:text-xl text-center px-6">
              Escape the Brainrot
            </span>
            
            {/* Ripple effect on hover */}
            {isHovered && (
              <div className="absolute inset-0 rounded-full bg-botanical-lavender/20 animate-ping"></div>
            )}
          </button>
        </div>
        
        {/* Subtle call to action */}
        <p className="text-botanical-text-light text-sm mt-8 animate-fade-in delay-500">
          Click the bubble to begin your journey
        </p>
      </div>
      
      {/* Bottom decorative text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-botanical-text-light text-sm font-light">
        Your mindful companion
      </div>
    </div>
  );
};

export default LandingPage;
