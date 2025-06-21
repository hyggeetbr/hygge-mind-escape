
import { useNavigate } from "react-router-dom";
import { CalendarDays, BarChart4, ListChecks, Sparkles, BookOpen, User, Home, Users, Bot, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleMeditate = () => {
    navigate("/meditate");
  };

  const handleTodaysReading = () => {
    navigate("/todays-reading");
  };

  const handleYoga = () => {
    navigate("/yoga");
  };

  const handleAskAI = () => {
    navigate("/ask-ai");
  };

  const handleSounds = () => {
    navigate("/sounds");
  };

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handlePremium = () => {
    navigate("/premium");
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
        <div>
          <h1 className="text-white text-3xl font-light mb-1">Good Morning</h1>
          <p className="text-white/60 text-sm">Here is your mindful guidance for today.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleProfile}
          className="text-white border-white/20 bg-white/10 hover:bg-white/20"
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fade-in">
          <div
            className="calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleMeditate}
          >
            <h2 className="text-xl font-medium mb-2 text-black">Meditate</h2>
            <p className="text-gray-500 mb-4">Find your inner peace with guided meditation.</p>
            <Sparkles className="w-6 h-6 text-calm-blue" />
          </div>

          <div
            className="calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleTodaysReading}
          >
            <h2 className="text-xl font-medium mb-2 text-black">Today's Reading</h2>
            <p className="text-gray-500 mb-4">Enlighten your mind with today's curated article.</p>
            <BookOpen className="w-6 h-6 text-calm-orange" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="calm-card p-4">
            <BarChart4 className="w-5 h-5 text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-black">Mood Tracker</h3>
            <p className="text-gray-500">Track your daily mood and identify patterns.</p>
          </div>

          <div className="calm-card p-4">
            <ListChecks className="w-5 h-5 text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-black">Goal Setting</h3>
            <p className="text-gray-500">Set and achieve your personal growth goals.</p>
          </div>

          <div
            className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleYoga}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-yoga-pose w-5 h-5 text-gray-500 mb-2"
            >
              <path d="M4 4v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2V4"/>
              <path d="M4 12v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2v-4"/>
              <path d="M4 20v-2c0-1.5 1-2 2.5 2h0c1.5 0 2.5.5 2.5 2v2"/>
              <path d="M12 4v16"/>
              <path d="M12 12H20"/>
              <path d="M16 8v8"/>
            </svg>
            <h3 className="text-lg font-medium text-black">Yoga</h3>
            <p className="text-gray-500">Rejuvenate your body and mind with yoga sessions.</p>
          </div>

          <div
            className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handleAskAI}
          >
            <Bot className="w-5 h-5 text-gray-500 mb-2" />
            <h3 className="text-lg font-medium text-black">Ask Lumina</h3>
            <p className="text-gray-500">Get personalized advice from our AI assistant.</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-calm-purple" />
            </div>
            <span className="text-white text-xs font-medium">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleSounds}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Sounds</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDiscover}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">🔍</div>
            <span className="text-white/60 text-xs">Discover</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleCommunity}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Users className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleAskAI}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Lumina</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handlePremium}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">⭐</div>
            <span className="text-white/60 text-xs">Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
