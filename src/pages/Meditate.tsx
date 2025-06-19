
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const MEDITATION_TECHNIQUES = [
  {
    title: "Breath Awareness",
    description: "Focus on the movement of your breath—inhale and exhale—to quiet the mind.",
    videoUrl: "https://www.youtube.com/embed/4GtpuD13nZk?si=rwiLZCWJipXe-Il8",
    participants: "88.7K"
  },
  {
    title: "Watching Thoughts", 
    description: "Observe your thoughts without judgment as they arise and pass away.",
    videoUrl: "https://www.youtube.com/embed/3TJefFc9UW4?si=tIBflf1LLL_5zOst",
    participants: "67.2K"
  },
  {
    title: "Sound Meditation",
    description: "Concentrate on subtle sounds (external or internal) to anchor your awareness.",
    videoUrl: "https://www.youtube.com/embed/unCya_-8ECs?si=9eJAaZlVzWuwtZHv",
    participants: "45.8K"
  },
];

const Meditate = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedTechnique, setSelectedTechnique] = useState<null | typeof MEDITATION_TECHNIQUES[0]>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center calm-gradient">
        <div className="text-white text-2xl font-light animate-pulse">Hygge</div>
      </div>
    );
  }

  const handleTechniqueClick = (technique: typeof MEDITATION_TECHNIQUES[0]) => {
    setSelectedTechnique(technique);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

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
        <div className="text-white text-xl font-medium">Meditation</div>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-white text-2xl font-light mb-2">
            Meditation techniques
          </h1>
          <p className="text-white/60 text-sm italic">
            from Vigyaan Bhairavtantra
          </p>
        </div>

        {/* Featured Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-white text-lg font-medium mb-4">Featured</h2>
          
          <div className="space-y-4">
            {MEDITATION_TECHNIQUES.map((technique, index) => (
              <div
                key={technique.title}
                onClick={() => handleTechniqueClick(technique)}
                className="calm-card p-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="relative h-32 bg-gradient-to-br from-calm-purple via-calm-purple to-calm-purple-light flex items-center justify-center">
                  <div className="text-white text-lg font-medium">{technique.title.toUpperCase()}</div>
                  <div className="absolute bottom-3 left-4 flex items-center space-x-2 text-white/80 text-sm">
                    <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded"></div>
                    </div>
                    <span>{technique.participants}</span>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-3 left-4 bg-calm-orange text-white text-xs px-2 py-1 rounded-full font-medium">
                      New
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="font-medium text-gray-800 mb-1">{technique.title}</div>
                  <div className="text-gray-600 text-sm">{technique.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-blue/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-blue text-xl">🧘</span>
              </div>
              <div className="font-medium text-gray-800 text-sm">Meditation</div>
            </div>

            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-orange/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-orange text-xl">🎵</span>
              </div>
              <div className="font-medium text-gray-800 text-sm">Music</div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Dialog */}
      <Dialog open={!!selectedTechnique} onOpenChange={(open) => { if (!open) setSelectedTechnique(null); }}>
        <DialogContent className="max-w-2xl px-0 calm-card border-0 shadow-2xl">
          {selectedTechnique && (
            <div className="flex flex-col items-center w-full pb-2">
              <div className="w-full flex justify-center pt-4">
                <span className="text-calm-purple text-lg font-medium tracking-wide mb-3">
                  Hygge <span className="font-bold">Play</span>
                </span>
              </div>
              <DialogHeader className="w-full flex justify-center">
                <DialogTitle className="text-xl text-gray-800 mb-2 text-center">
                  {selectedTechnique.title}
                </DialogTitle>
              </DialogHeader>
              <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="360"
                  src={selectedTechnique.videoUrl}
                  title={selectedTechnique.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64 md:h-96"
                ></iframe>
              </div>
              <DialogClose asChild>
                <button className="mt-6 px-8 py-3 rounded-full bg-calm-purple text-white font-medium hover:bg-calm-purple/90 transition w-full max-w-xs mx-auto">
                  Close
                </button>
              </DialogClose>
            </div>
          )}
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

export default Meditate;
