import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleMeditate = () => {
    navigate("/meditate");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <span className="font-display text-5xl text-hygge-moss animate-fade-in transition-all duration-500">Hygge</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-hygge-cream overflow-hidden">
      {/* Background floating bubbles */}
      <div>
        <div className="absolute top-16 left-8 w-40 h-40 bg-hygge-sage/20 rounded-full blur-2xl animate-float z-0 pointer-events-none" />
        <div className="absolute top-60 right-20 w-56 h-56 bg-hygge-sky/20 rounded-full blur-2xl animate-float z-0 pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-hygge-stone/25 rounded-full blur-xl animate-pulse-soft z-0 pointer-events-none" />
        <div className="absolute bottom-10 right-36 w-36 h-36 bg-hygge-mist/25 rounded-full blur-xl animate-float z-0 pointer-events-none" style={{ animationDelay: "2s" }} />
      </div>

      {/* Logout Button */}
      <div className="absolute top-6 right-8 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          className="border-hygge-sage text-hygge-moss hover:bg-hygge-sage/20 bg-white/80 shadow-md"
        >
          <LogOut size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="font-display text-3xl md:text-4xl text-hygge-moss mb-10 drop-shadow-sm animate-fade-in">
          Welcome to your Meditation Space
        </h1>
        <div
          className="w-[90vw] max-w-md px-8 py-12 rounded-2xl shadow-2xl backdrop-blur-md bg-white/80 border-2 border-hygge-stone/20 flex flex-col items-center transition-shadow mb-4 animate-fade-in"
        >
          <button
            className="w-full py-6 px-6 rounded-xl text-2xl font-display bg-hygge-moss text-hygge-cream shadow-lg transition hover:bg-hygge-sage hover:text-hygge-earth focus:ring-4 focus:ring-hygge-sage/40 focus:outline-none"
            onClick={handleMeditate}
          >
            Meditate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
