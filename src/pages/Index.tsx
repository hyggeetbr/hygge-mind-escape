
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <div className="text-center">
          <h1 className="text-2xl font-display text-hygge-moss mb-4">
            Welcome to Hygge!
          </h1>
          <p className="text-hygge-earth mb-4">
            You are successfully authenticated as: {user.email}
          </p>
          <button
            onClick={() => {
              console.log("Sign out functionality coming soon");
            }}
            className="text-hygge-moss hover:text-hygge-earth underline"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
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
