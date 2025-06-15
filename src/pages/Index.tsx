
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AuthPage from "@/components/AuthPage";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  console.log("Index component rendering:", { user, loading, showAuth });

  // Check if Supabase is configured
  const supabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  const handleEnterApp = () => {
    console.log("Enter app clicked");
    if (!supabaseConfigured) {
      alert("Please connect Supabase integration first using the green Supabase button in the top right corner.");
      return;
    }
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

  // Show Supabase setup message if not configured
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-3xl font-display text-hygge-moss mb-4">
            Almost Ready!
          </h1>
          <p className="text-hygge-earth mb-6">
            To enable authentication, please connect your Supabase project using the green Supabase button in the top right corner of the Lovable interface.
          </p>
          <div className="text-sm text-hygge-stone">
            Once connected, refresh this page to continue.
          </div>
        </div>
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
