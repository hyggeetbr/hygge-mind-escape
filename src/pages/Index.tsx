
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  const handleEnterApp = () => {
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    setShowAuth(false);
  };

  const handleAuthSuccess = () => {
    // For now, just go back to landing - you can later redirect to a dashboard
    setShowAuth(false);
    console.log("User authenticated successfully:", user);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-hygge-moss">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, you might want to show a different page
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-hygge-moss mb-4">
            Welcome to Hygge!
          </h1>
          <p className="text-hygge-earth mb-4">
            You are successfully authenticated as: {user.email}
          </p>
          <button
            onClick={() => {
              // You can implement sign out here
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
