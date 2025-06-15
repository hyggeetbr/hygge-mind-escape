
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Meditate = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

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
      {/* Floating Bubbles */}
      <div>
        <div className="absolute top-16 left-10 w-36 h-36 bg-hygge-sage/15 rounded-full blur-2xl animate-float z-0 pointer-events-none" />
        <div className="absolute top-64 right-20 w-44 h-44 bg-hygge-sky/15 rounded-full blur-2xl animate-float z-0 pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-16 left-28 w-24 h-24 bg-hygge-stone/15 rounded-full blur-xl animate-pulse-soft z-0 pointer-events-none" />
        <div className="absolute bottom-10 right-32 w-32 h-32 bg-hygge-mist/15 rounded-full blur-xl animate-float z-0 pointer-events-none" style={{ animationDelay: "2s" }} />
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
        <div className="w-[90vw] max-w-xl px-8 py-12 rounded-2xl shadow-2xl backdrop-blur-md bg-white/80 border-2 border-hygge-stone/20 flex flex-col items-center transition-shadow animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl text-hygge-moss mb-6 text-center">
            Meditation Techniques<br />from <span className="italic font-normal">Vigyan Bhairavtantra</span>
          </h1>
          {/* You may add meditation steps or cards here in the future */}
        </div>
      </div>
    </div>
  );
};

export default Meditate;
