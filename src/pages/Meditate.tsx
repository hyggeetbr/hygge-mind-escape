
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const MEDITATION_TECHNIQUES = [
  {
    title: "Breath Awareness",
    description: "Focus on the movement of your breath—inhale and exhale—to quiet the mind.",
  },
  {
    title: "Watching Thoughts",
    description: "Observe your thoughts without judgment as they arise and pass away.",
  },
  {
    title: "Sound Meditation",
    description: "Concentrate on subtle sounds (external or internal) to anchor your awareness.",
  },
];

const Meditate = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hygge-cream">
        <span className="font-display text-5xl text-hygge-moss animate-fade-in transition-all duration-500">
          Hygge
        </span>
      </div>
    );
  }

  const handleTechniqueClick = (technique: string) => {
    // For now, just alert. You can customize navigation here in the future.
    alert(`You selected "${technique}"`);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-hygge-cream overflow-hidden">
      {/* Floating Bubbles */}
      <div>
        <div className="absolute top-16 left-10 w-36 h-36 bg-hygge-sage/15 rounded-full blur-2xl animate-float z-0 pointer-events-none" />
        <div
          className="absolute top-64 right-20 w-44 h-44 bg-hygge-sky/15 rounded-full blur-2xl animate-float z-0 pointer-events-none"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute bottom-16 left-28 w-24 h-24 bg-hygge-stone/15 rounded-full blur-xl animate-pulse-soft z-0 pointer-events-none" />
        <div
          className="absolute bottom-10 right-32 w-32 h-32 bg-hygge-mist/15 rounded-full blur-xl animate-float z-0 pointer-events-none"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-[90vw] max-w-xl px-8 py-12 rounded-2xl shadow-2xl backdrop-blur-md bg-white/80 border-2 border-hygge-stone/20 animate-fade-in">
        <h1 className="font-display text-2xl md:text-3xl text-hygge-moss mb-8 text-center">
          Meditation techniques<br />
          <span className="italic text-lg font-normal">
            from Vigyaan Bhairavtantra
          </span>
        </h1>

        <div className="flex flex-col gap-6 w-full">
          {MEDITATION_TECHNIQUES.map((tech, idx) => (
            <button
              key={tech.title}
              onClick={() => handleTechniqueClick(tech.title)}
              className="group w-full px-6 py-5 rounded-xl border border-hygge-sage/40 bg-hygge-mist/40 font-display text-lg md:text-xl text-hygge-moss shadow-md transition hover:bg-hygge-sage/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-hygge-sage/40"
              style={{
                animationDelay: `${idx * 0.07 + 0.1}s`,
                animationName: "fade-in",
                animationFillMode: "both",
                animationDuration: "0.6s",
              }}
            >
              <div className="text-hygge-moss font-semibold mb-1">
                {tech.title}
              </div>
              <div className="text-hygge-earth/70 text-sm md:text-base">
                {tech.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Meditate;
