
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeSelector from "@/components/ThemeSelector";

const NotFound = () => {
  const location = useLocation();
  const [currentBackground, setCurrentBackground] = useState("url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
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
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-botanical-lavender/30 rounded-full blur-xl"></div>
        <div className="floating-element absolute bottom-32 right-16 w-24 h-24 bg-botanical-sage/25 rounded-full blur-lg"></div>
        <div className="floating-element absolute top-1/3 right-20 w-16 h-16 bg-botanical-cream/40 rounded-full blur-md"></div>
      </div>

      <div className="calm-card p-8 text-center animate-fade-in relative z-10">
        <h1 className="text-6xl font-bold mb-4 text-botanical-text-dark">404</h1>
        <p className="text-xl text-botanical-text-medium mb-6">Oops! Page not found</p>
        <p className="text-botanical-text-light mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <a 
          href="/" 
          className="calm-button px-6 py-3 inline-block hover:scale-105 transition-all duration-300"
        >
          Return to Home
        </a>
      </div>

      <ThemeSelector onThemeChange={setCurrentBackground} />
    </div>
  );
};

export default NotFound;
