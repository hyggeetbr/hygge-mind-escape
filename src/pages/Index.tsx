
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  console.log("Index component rendering:", { user, loading, showAuth });

  const handleEnterApp = () => {
    console.log("Enter app clicked");
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    console.log("Back to landing clicked");
    setShowAuth(false);
  };

  const handleAuthSuccess = () => {
    console.log("Auth success, user:", user);
    setShowAuth(false);
    navigate("/dashboard");
  };

  if (loading) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center calm-gradient">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <span className="text-5xl text-white/30 font-light">Hygge</span>
          </div>
          <span className="relative text-5xl text-white font-light animate-fade-in">Hygge</span>
        </div>
      </div>
    );
  }

  if (user) {
    console.log("User is authenticated, showing welcome page");
    if (window.location.pathname !== "/dashboard") {
      navigate("/dashboard");
      return null;
    }
    return null;
  }

  console.log("Showing main app flow:", { showAuth });

  return (
    <div className="min-h-screen overflow-hidden">
      {!showAuth ? (
        <LandingPage onEnterApp={handleEnterApp} />
      ) : (
        <AuthPage onBack={handleBackToLanding} onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default Index;
