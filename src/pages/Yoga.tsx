
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
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
  const [showPranayama, setShowPranayama] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handlePranayama = () => {
    setShowPranayama(true);
  };

  const handleDharana = () => {
    console.log("Dharana practice started");
  };

  const handleDhyana = () => {
    console.log("Dhyana practice started");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center calm-gradient">
        <div className="text-white text-2xl font-light animate-pulse">Hygge</div>
      </div>
    );
  }

  const yogaPractices = [
    {
      title: "Pranayama",
      description: "The practice of breath control and regulation for inner peace and vitality",
      icon: "🫁",
      onClick: handlePranayama,
      participants: "152.3K"
    },
    {
      title: "Dharana", 
      description: "The practice of concentration and focused attention on a single object",
      icon: "🎯",
      onClick: handleDharana,
      participants: "89.7K"
    },
    {
      title: "Dhyana",
      description: "The practice of meditation and sustained awareness beyond thought", 
      icon: "🧘",
      onClick: handleDhyana,
      participants: "234.1K"
    }
  ];

  return (
    <div className="min-h-screen calm-gradient relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-white/4 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-white text-xl font-medium">Yoga</div>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-white text-2xl font-light mb-2">
            Yoga for the Day
          </h1>
          <p className="text-white/60 text-sm">
            Classical techniques from Patanjali's Yoga Sutra
          </p>
        </div>

        {/* Featured Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-white text-lg font-medium mb-4">Featured</h2>
          
          <div className="space-y-4">
            {yogaPractices.map((practice, index) => (
              <div
                key={practice.title}
                onClick={practice.onClick}
                className="calm-card p-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="relative h-32 bg-gradient-to-br from-calm-orange via-amber-400 to-orange-400 flex items-center justify-center">
                  <div className="text-4xl mb-2">{practice.icon}</div>
                  <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-white/90 text-sm">
                    <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    <span>{practice.participants}</span>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 left-4 bg-white text-calm-orange text-xs px-2 py-1 rounded-full font-medium">
                      New
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium text-gray-800 mb-1">{practice.title}</div>
                  <div className="text-gray-600 text-sm">{practice.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="grid grid-cols-3 gap-4">
            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-blue/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-blue text-xl">🌙</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">Sleep</div>
            </div>

            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-purple/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-purple text-xl">🧘</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">Meditation</div>
            </div>

            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-orange/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-orange text-xl">🎵</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">Music</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pranayama Info Dialog */}
      <Dialog open={showPranayama} onOpenChange={setShowPranayama}>
        <DialogContent className="max-w-md calm-card border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-800 text-xl text-center">
              Pranayama
            </DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <div className="text-6xl mb-4">🫁</div>
            <p className="text-gray-600 text-sm mb-6">
              Pranayama is the yogic practice of mindful breathing. By guiding
              the flow of inhalation and exhalation, it cultivates calmness and
              vitality throughout the body and mind.
            </p>
            <DialogClose asChild>
              <button className="w-full px-4 py-3 rounded-full bg-calm-purple text-white font-medium hover:bg-calm-purple/90 transition">
                Begin Practice
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="flex justify-around py-3">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">🏠</div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">🌙</div>
            <span className="text-white/60 text-xs">Sleep</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-calm-purple rounded-sm"></div>
            </div>
            <span className="text-white text-xs font-medium">Discover</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">👤</div>
            <span className="text-white/60 text-xs">Profile</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">⭐</div>
            <span className="text-white/60 text-xs">Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yoga;
