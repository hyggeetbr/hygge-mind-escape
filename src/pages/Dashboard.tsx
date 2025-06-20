import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, BookOpen, Brain, Check, Flower2, Sparkles, Gift, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Mock completion status
  const [meditationComplete, setMeditationComplete] = useState(false);
  const [readingComplete, setReadingComplete] = useState(false);
  const [yogaComplete, setYogaComplete] = useState(false);
  
  const completedTasks = (meditationComplete ? 1 : 0) + (readingComplete ? 1 : 0) + (yogaComplete ? 1 : 0);
  const progressPercentage = (completedTasks / 3) * 100;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleMeditate = () => {
    navigate("/meditate");
    setMeditationComplete(true);
  };

  const handleTodaysReading = () => {
    navigate("/todays-reading");
    setReadingComplete(true);
  };

  const handleYoga = () => {
    navigate("/yoga");
    setYogaComplete(true);
  };

  const handleAskAI = () => {
    navigate("/ask-ai");
  };

  const handleSleep = () => {
    navigate("/sleep");
  };

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handlePremium = () => {
    navigate("/premium");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center calm-gradient">
        <div className="text-white text-2xl font-light animate-pulse">Hygge</div>
      </div>
    );
  }

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen calm-gradient relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-white/4 rounded-full blur-lg" />
        <div className="floating-element absolute bottom-20 right-16 w-40 h-40 bg-white/2 rounded-full blur-xl" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <Settings className="w-6 h-6 text-white/80" />
        </div>
        <div className="text-white text-xl font-medium">Hygge</div>
        <div className="flex items-center space-x-4">
          <Gift 
            className="w-6 h-6 text-calm-orange cursor-pointer hover:scale-110 transition-transform" 
            onClick={handlePremium}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white/80 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Greeting */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-white text-2xl font-light mb-2">
            {getGreeting()}, {user?.email?.split('@')[0] || 'Friend'}
          </h1>
        </div>

        {/* Premium Banner */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div 
            className="calm-card p-4 flex items-center justify-between cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={handlePremium}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-calm-orange rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Unlock everything with</div>
                <div className="font-semibold text-gray-800">Hygge Premium</div>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="calm-card p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Today's Progress</h3>
              <p className="text-gray-600 text-sm">{completedTasks} of 3 mindful tasks completed</p>
            </div>
            
            <div className="mb-6">
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-gray-100"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium text-calm-purple">{Math.round(progressPercentage)}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                meditationComplete 
                  ? 'bg-calm-purple/10 border-calm-purple/30' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-1.5 rounded-full ${
                    meditationComplete ? 'bg-calm-purple text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {meditationComplete ? <Check size={12} /> : <Brain size={12} />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-700">Meditation</p>
                    <p className="text-xs text-gray-500">
                      {meditationComplete ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                readingComplete 
                  ? 'bg-calm-blue/10 border-calm-blue/30' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-1.5 rounded-full ${
                    readingComplete ? 'bg-calm-blue text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {readingComplete ? <Check size={12} /> : <BookOpen size={12} />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-700">Reading</p>
                    <p className="text-xs text-gray-500">
                      {readingComplete ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                yogaComplete 
                  ? 'bg-calm-orange/10 border-calm-orange/30' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-1.5 rounded-full ${
                    yogaComplete ? 'bg-calm-orange text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {yogaComplete ? <Check size={12} /> : <Flower2 size={12} />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-700">Yoga</p>
                    <p className="text-xs text-gray-500">
                      {yogaComplete ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Section */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-medium">Popular on Hygge</h2>
            <span className="text-white/60 text-sm">See All</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Meditation Card */}
            <div 
              className="calm-card p-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleMeditate}
            >
              <div className="relative h-32 bg-gradient-to-br from-calm-purple to-calm-purple-light flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
                <div className="absolute bottom-2 left-3 flex items-center space-x-1 text-white/80 text-xs">
                  <div className="w-3 h-3 rounded bg-white/20" />
                  <span>88.7K</span>
                </div>
              </div>
              <div className="p-3">
                <div className="font-medium text-gray-800 text-sm mb-1">Mindful Meditation</div>
                <div className="text-gray-600 text-xs">Meditation • 3 minutes</div>
              </div>
            </div>

            {/* Reading Card */}
            <div 
              className="calm-card p-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleTodaysReading}
            >
              <div className="relative h-32 bg-gradient-to-br from-calm-blue to-blue-400 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
                <div className="absolute bottom-2 left-3 flex items-center space-x-1 text-white/80 text-xs">
                  <div className="w-3 h-3 rounded bg-white/20" />
                  <span>47.6K</span>
                </div>
              </div>
              <div className="p-3">
                <div className="font-medium text-gray-800 text-sm mb-1">Daily Reading</div>
                <div className="text-gray-600 text-xs">Wisdom • Today</div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Dailies */}
        <div className="animate-fade-in mb-16" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-white text-lg font-medium mb-4">Today's Dailies</h2>
          
          <div className="space-y-4">
            {/* Yoga Card */}
            <div 
              className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleYoga}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-calm-orange/20 rounded-lg flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-calm-orange" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Yoga Practice</div>
                  <div className="text-gray-600 text-sm">Harmonize body and mind</div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </div>

            {/* Ask AI Card */}
            <div 
              className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleAskAI}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-calm-purple/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-calm-purple" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Ask from AI</div>
                  <div className="text-gray-600 text-sm">Get mindful guidance</div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </div>

            {/* Community Card */}
            <div 
              className="calm-card p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleCommunity}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-calm-blue/20 rounded-lg flex items-center justify-center">
                  <div className="text-xl">👥</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">Community</div>
                  <div className="text-gray-600 text-sm">Connect with mindful souls</div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-calm-purple rounded-sm"></div>
            </div>
            <span className="text-white text-xs font-medium">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleSleep}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">🌙</div>
            <span className="text-white/60 text-xs">Sleep</span>
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
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">👥</div>
            <span className="text-white/60 text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleProfile}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">👤</div>
            <span className="text-white/60 text-xs">Profile</span>
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
