
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music, BookOpen, Lightbulb, Globe, Heart, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeSelector from "@/components/ThemeSelector";

const DailyWisdomSections = () => {
  const navigate = useNavigate();
  const [currentBackground, setCurrentBackground] = useState("url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')");

  const wisdomSections = [
    {
      title: "Ancient Teachings",
      description: "Timeless wisdom from ancient philosophers and spiritual masters",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-amber-500 to-orange-500",
      route: "/daily-wisdom/ancient-teachings"
    },
    {
      title: "Modern Mindfulness", 
      description: "Contemporary approaches to mindful living and awareness",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "from-blue-500 to-teal-500",
      route: "/daily-wisdom/modern-mindfulness"
    },
    {
      title: "Wisdom from the World",
      description: "Universal insights from diverse cultures and traditions",
      icon: <Globe className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      route: "/daily-wisdom/wisdom-from-world"
    },
    {
      title: "Emotional Wisdom",
      description: "Understanding and navigating the depths of human emotion",
      icon: <Heart className="w-8 h-8" />,
      color: "from-pink-500 to-rose-500",
      route: "/daily-wisdom/emotional-wisdom"
    },
    {
      title: "Everyday Philosophy",
      description: "Practical wisdom for daily life decisions and challenges",
      icon: <Coffee className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500",
      route: "/daily-wisdom/everyday-philosophy"
    }
  ];

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: currentBackground,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-botanical-lavender/30 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-botanical-sage/25 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-botanical-cream/40 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/discover")}
          className="text-botanical-text-dark hover:bg-white/20 hover:text-botanical-text-dark"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-botanical-text-dark text-xl font-medium">Daily Wisdom</h1>
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-botanical-text-dark text-3xl font-light mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Explore Wisdom Categories
          </h2>
          <p className="text-botanical-text-medium text-lg">
            Discover profound insights organized by themes and traditions
          </p>
        </div>

        {/* Wisdom Sections Grid */}
        <div className="grid gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {wisdomSections.map((section, index) => (
            <div 
              key={section.title}
              className="animate-fade-in cursor-pointer"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              onClick={() => navigate(section.route)}
            >
              <div className="calm-card p-6 hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-botanical-text-dark text-xl font-semibold mb-2">{section.title}</h3>
                    <p className="text-botanical-text-medium text-sm leading-relaxed">{section.description}</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-botanical-text-light rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-botanical-purple/30 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Home className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 bg-botanical-purple rounded-full flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="text-botanical-text-dark text-xs font-medium">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Users className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Bot className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Lumina</span>
          </div>
        </div>
      </div>

      <ThemeSelector onThemeChange={setCurrentBackground} />
    </div>
  );
};

export default DailyWisdomSections;
