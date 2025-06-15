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
    // Redirect to dashboard if login successful
    navigate("/dashboard");
  };

  if (loading) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <div className="text-hygge-moss text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    console.log("User is authenticated, showing welcome page");
    // If Auth success, redirect to dashboard (if not already there)
    // But to avoid accidental redirect loop on dashboard, only redirect if not already there
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
