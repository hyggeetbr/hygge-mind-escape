
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const Yoga = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const [showPranayama, setShowPranayama] = useState(false);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handlePranayama = () => {
    setShowPranayama(true);
  };

  const handleDharana = () => {
    console.log("Dharana practice started");
    // In real app, would implement dharana session
  };

  const handleDhyana = () => {
    console.log("Dhyana practice started");
    // In real app, would implement dhyana session
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
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-8 w-64 h-64 bg-gradient-to-br from-hygge-stone/30 to-hygge-sage/20 rounded-full blur-3xl animate-float opacity-60" />
        <div className="absolute top-40 right-16 w-80 h-80 bg-gradient-to-br from-hygge-mist/25 to-hygge-stone/30 rounded-full blur-3xl animate-float opacity-50" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-gradient-to-br from-hygge-sage/40 to-hygge-stone/20 rounded-full blur-2xl animate-pulse-soft opacity-40" />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-8 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBack}
          className="border-hygge-stone/50 text-hygge-moss hover:bg-hygge-stone/30 bg-white/70 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-4">
        {/* Title */}
        <div className="text-center pt-16 pb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 rounded-full bg-hygge-stone/20 backdrop-blur-sm">
              <Flower2 size={48} className="text-hygge-moss" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-hygge-moss mb-4 drop-shadow-lg">
            Yoga for the Day
          </h1>
          <p className="text-hygge-earth/80 text-lg max-w-2xl mx-auto">
            Choose your practice from these classical techniques from Patanjali's Yoga Sutra
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-hygge-stone to-hygge-sage mx-auto rounded-full opacity-60"></div>
        </div>

        {/* Yoga Technique Options */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-md mx-auto">
          {/* Pranayama */}
          <div 
            className="animate-fade-in cursor-pointer group w-full"
            onClick={handlePranayama}
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-hygge-stone/30 to-hygge-sage/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="text-center">
                  <h3 className="font-display text-2xl text-hygge-moss mb-3 font-semibold">Pranayama</h3>
                  <p className="text-hygge-earth/80 text-sm leading-relaxed mb-4">
                    The practice of breath control and regulation for inner peace and vitality
                  </p>
                  <div className="w-full h-1 bg-gradient-to-r from-hygge-stone/50 to-hygge-sage/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dharana */}
          <div 
            className="animate-fade-in cursor-pointer group w-full"
            onClick={handleDharana}
            style={{ animationDelay: "0.6s" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-hygge-stone/30 to-hygge-sage/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="text-center">
                  <h3 className="font-display text-2xl text-hygge-moss mb-3 font-semibold">Dharana</h3>
                  <p className="text-hygge-earth/80 text-sm leading-relaxed mb-4">
                    The practice of concentration and focused attention on a single object
                  </p>
                  <div className="w-full h-1 bg-gradient-to-r from-hygge-stone/50 to-hygge-sage/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Dhyana */}
          <div 
            className="animate-fade-in cursor-pointer group w-full"
            onClick={handleDhyana}
            style={{ animationDelay: "0.9s" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-hygge-stone/30 to-hygge-sage/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="text-center">
                  <h3 className="font-display text-2xl text-hygge-moss mb-3 font-semibold">Dhyana</h3>
                  <p className="text-hygge-earth/80 text-sm leading-relaxed mb-4">
                    The practice of meditation and sustained awareness beyond thought
                  </p>
                  <div className="w-full h-1 bg-gradient-to-r from-hygge-stone/50 to-hygge-sage/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pranayama Info Dialog */}
        <Dialog open={showPranayama} onOpenChange={setShowPranayama}>
          <DialogContent className="max-w-md bg-white/80">
            <DialogHeader>
              <DialogTitle className="text-hygge-moss font-display text-xl">
                Pranayama
              </DialogTitle>
            </DialogHeader>
            <p className="text-hygge-earth/80 text-sm">
              Pranayama is the yogic practice of mindful breathing. By guiding
              the flow of inhalation and exhalation, it cultivates calmness and
              vitality throughout the body and mind.
            </p>
            <DialogClose asChild>
              <button className="mt-4 px-4 py-2 rounded bg-hygge-moss text-hygge-cream w-full">
                Close
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* Subtle Footer */}
        <div className="text-center pb-12 animate-fade-in" style={{ animationDelay: "1.2s" }}>
          <p className="text-hygge-earth/60 text-sm font-light tracking-wide">
            Begin your journey within
          </p>
        </div>
      </div>
    </div>
  );
};

export default Yoga;
