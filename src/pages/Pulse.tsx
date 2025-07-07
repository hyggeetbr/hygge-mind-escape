
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Pulse = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const pulseItems = [
    {
      id: 1,
      title: "The Pause is Power",
      content: "Every breath pauses before turning. Life offers the same—a moment before action, a space before reaction. Most rush past it. But in that pause lives your freedom. When you slow down, the choice returns to you. Try it: next time you're triggered, pause. That moment is yours. And within it is all your strength.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 2,
      title: "You Are Not Your Thoughts",
      content: "Your thoughts are just weather. Temporary. Passing. Some are loud storms, others soft winds. But you—you're the sky. Still. Unmoved. Eternal. Meditation isn't about stopping thoughts; it's about seeing them clearly. Step back. Watch them come and go. You'll see: the one who watches is deeper than anything that can be thought.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 3,
      title: "Socrates Wasn't Kidding",
      content: "'Know thyself' isn't an idea—it's a path. You're a mystery even to yourself. Beneath your patterns, your roles, your names—there's something untouched. Start small: notice how you respond to discomfort. Ask why. Then go deeper. To know yourself is to become free from yourself. The person watching is already wiser than the one performing.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 4,
      title: "Desire is a Treadmill",
      content: "You chase. You achieve. Then you want again. Desire has no finish line. It whispers, 'Just this one more thing…' but never stops. What if, just for today, you paused the chase? Sat still? Listened to the silence beneath wanting? That's contentment. And it doesn't come after desire—it comes without it.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 5,
      title: "Return to the Breath",
      content: "Wherever you are, the breath is there. It's your anchor. Your reset. Your witness. Inhale, and the world slows. Exhale, and the noise fades. Try this now: feel one breath completely. From start to stillness. The breath asks for nothing. Demands nothing. But gives everything—presence, space, and the memory of who you were before thinking began.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 6,
      title: "The Mind Hates the Present",
      content: "The mind is a time traveler. It loves the past. It clings to futures. But the now? It resists it. Why? Because in the now, the mind becomes useless. There's nothing to fix, no image to uphold. Just this moment. If you sit with it, you'll feel it: beneath thought, there's no problem. Just peace.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 7,
      title: "This Moment Won't Return",
      content: "This second—the light, the scent in the air, the weight in your chest—it will never happen again. All of it is vanishing even as you read. That's not tragic. That's sacred. To see impermanence is to see value. Pay attention. Because this, right now, is all that's ever real.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 8,
      title: "Peace Isn't a Place",
      content: "We keep waiting for peace. When I finish this. When I fix that. But peace isn't a destination. It's not in a job, a relationship, a future. It's in the space between two breaths. It's in letting go of control. It's now, or never. Every moment is offering it—you just have to stop chasing and start seeing.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 9,
      title: "Everything is Borrowed",
      content: "Your body. Your breath. The sunrise. The touch of someone who loves you. All borrowed. All temporary. But not meaningless. That's what makes them sacred. To own something is to forget it. But to know it's passing? That brings gratitude. Live like you're just visiting. Because you are.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    },
    {
      id: 10,
      title: "The Light You Seek is Within",
      content: "Every seeker eventually hits a wall. More books don't help. More advice falls flat. That's when the turn happens. Inward. Toward the still place inside. It's always been there—behind every breath, beneath every silence. The same light you've been chasing lives in the one who's chasing. You don't find it. You remember it.",
      image: "/lovable-uploads/b9735981-828e-4d4b-b080-d0eefc24c1f7.png"
    }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = container.scrollHeight / pulseItems.length;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < pulseItems.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Pulse</h1>
        <div className="w-10"></div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="h-[calc(100vh-140px)] overflow-y-auto snap-y snap-mandatory"
        onScroll={handleScroll}
      >
        {pulseItems.map((item, index) => (
          <div key={item.id} className="h-full snap-center flex flex-col">
            {/* Photo Banner */}
            <div className="h-64 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h2 className="text-white text-2xl font-bold mb-4 text-center">
                {item.title}
              </h2>
              <p className="text-white/90 text-lg leading-relaxed text-center max-w-2xl mx-auto">
                {item.content}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 pb-6">
              {pulseItems.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Home className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Music className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Echo</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-white text-xs font-medium">Pulse</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Users className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Lumina</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pulse;
