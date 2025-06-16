
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, BookOpen, Brain } from "lucide-react";
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

  const handleTodaysReading = () => {
    navigate("/todays-reading");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-hygge-cream via-hygge-mist to-hygge-sage/20">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <span className="font-display text-5xl text-hygge-moss/30">Hygge</span>
          </div>
          <span className="relative font-display text-5xl text-hygge-moss animate-fade-in">Hygge</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-hygge-cream via-hygge-mist to-hygge-sage/20">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating elements */}
        <div className="absolute top-20 left-8 w-64 h-64 bg-gradient-to-br from-hygge-sage/30 to-hygge-sky/20 rounded-full blur-3xl animate-float opacity-60" />
        <div className="absolute top-40 right-16 w-80 h-80 bg-gradient-to-br from-hygge-sky/25 to-hygge-mist/30 rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-gradient-to-br from-hygge-stone/40 to-hygge-sage/20 rounded-full blur-2xl animate-pulse-soft opacity-40" />
        <div className="absolute bottom-20 right-32 w-56 h-56 bg-gradient-to-br from-hygge-moss/20 to-hygge-sky/25 rounded-full blur-3xl animate-float opacity-45" style={{ animationDelay: "2.5s" }} />
        
        {/* Secondary ambient particles */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-hygge-sage/15 rounded-full blur-xl animate-pulse-soft opacity-30" style={{ animationDelay: "3s" }} />
        <div className="absolute top-2/3 right-1/4 w-40 h-40 bg-hygge-sky/20 rounded-full blur-2xl animate-float opacity-25" style={{ animationDelay: "4s" }} />
        
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-hygge-cream/50 via-transparent to-hygge-mist/30 pointer-events-none" />
      </div>

      {/* Logout Button - Enhanced */}
      <div className="absolute top-6 right-8 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          className="border-hygge-sage/50 text-hygge-moss hover:bg-hygge-sage/30 bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <LogOut size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Welcome Text - Enhanced Typography */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-hygge-moss mb-4 drop-shadow-lg">
            Welcome to your
          </h1>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-gradient bg-gradient-to-r from-hygge-sage to-hygge-sky bg-clip-text text-transparent drop-shadow-sm">
            daily tasks
          </h2>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-hygge-sage to-hygge-sky mx-auto rounded-full opacity-60"></div>
        </div>

        {/* Floating Bubble Buttons */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Meditation Bubble */}
          <div 
            className="absolute left-8 md:left-16 lg:left-24 top-0 animate-float cursor-pointer group"
            onClick={handleMeditate}
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-moss/30 to-hygge-sage/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Main bubble */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-moss/20 to-hygge-sage/10 opacity-50"></div>
                
                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="mb-6 p-4 rounded-full bg-hygge-moss/20 backdrop-blur-sm group-hover:bg-hygge-moss/30 transition-all duration-300">
                    <Brain size={48} className="text-hygge-moss" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-hygge-moss mb-3 font-semibold">Meditate</h3>
                  <p className="text-hygge-earth/80 text-sm md:text-base leading-relaxed">Find your inner peace and clarity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Reading Bubble */}
          <div 
            className="absolute right-8 md:right-16 lg:right-24 top-20 md:top-32 animate-float cursor-pointer group"
            onClick={handleTodaysReading}
            style={{ animationDelay: "1.2s" }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-sky/30 to-hygge-sage/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Main bubble */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-sky/20 to-hygge-stone/10 opacity-50"></div>
                
                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="mb-6 p-4 rounded-full bg-hygge-sky/20 backdrop-blur-sm group-hover:bg-hygge-sky/30 transition-all duration-300">
                    <BookOpen size={48} className="text-hygge-moss" />
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl text-hygge-moss mb-3 font-semibold">Today's Reading</h3>
                  <p className="text-hygge-earth/80 text-sm md:text-base leading-relaxed">Nourish your mind with wisdom</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Call to Action */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center animate-fade-in" style={{ animationDelay: "2s" }}>
          <p className="text-hygge-earth/60 text-sm font-light tracking-wide">
            Choose your path to mindfulness
          </p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-hygge-sage/40 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-hygge-sky/40 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-2 h-2 rounded-full bg-hygge-stone/40 animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
