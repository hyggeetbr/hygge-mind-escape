
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);

  const handleEnterApp = () => {
    setShowAuth(true);
  };

  const handleBackToLanding = () => {
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {!showAuth ? (
        <LandingPage onEnterApp={handleEnterApp} />
      ) : (
        <AuthPage onBack={handleBackToLanding} />
      )}
    </div>
  );
};

export default Index;
