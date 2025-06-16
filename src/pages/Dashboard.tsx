import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, BookOpen, Brain, Check, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Mock completion status - in real app this would come from your database
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
    // In real app, you would track completion here
    setMeditationComplete(true);
  };

  const handleTodaysReading = () => {
    navigate("/todays-reading");
    // In real app, you would track completion here
    setReadingComplete(true);
  };

  const handleYoga = () => {
    // For now, just mark as complete - in real app would navigate to yoga page
    setYogaComplete(true);
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

      {/* Logout Button */}
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
      <div className="relative z-10 flex flex-col min-h-screen px-4">
        {/* Welcome Text at Top */}
        <div className="text-center pt-16 pb-8 animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-hygge-moss mb-4 drop-shadow-lg">
            Welcome to your
          </h1>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-gradient bg-gradient-to-r from-hygge-sage to-hygge-sky bg-clip-text text-transparent drop-shadow-sm">
            daily tasks
          </h2>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-hygge-sage to-hygge-sky mx-auto rounded-full opacity-60"></div>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-lg mx-auto mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-4">
              <h3 className="font-display text-xl text-hygge-moss mb-2">Today's Progress</h3>
              <p className="text-hygge-earth/70 text-sm">{completedTasks} of 3 tasks completed</p>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-hygge-mist/50"
              />
              <div className="flex justify-between mt-2 text-xs text-hygge-earth/60">
                <span>0%</span>
                <span className="font-medium text-hygge-moss">{Math.round(progressPercentage)}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Task Status Cards */}
            <div className="grid grid-cols-3 gap-3">
              {/* Meditation Status */}
              <div className={`relative p-3 rounded-xl border transition-all duration-300 ${
                meditationComplete 
                  ? 'bg-hygge-moss/20 border-hygge-moss/30 shadow-lg' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-1.5 rounded-full transition-colors ${
                    meditationComplete ? 'bg-hygge-moss text-white' : 'bg-hygge-moss/20 text-hygge-moss'
                  }`}>
                    {meditationComplete ? <Check size={12} /> : <Brain size={12} />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-hygge-moss">Meditation</p>
                    <p className="text-xs text-hygge-earth/60">
                      {meditationComplete ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reading Status */}
              <div className={`relative p-3 rounded-xl border transition-all duration-300 ${
                readingComplete 
                  ? 'bg-hygge-sky/20 border-hygge-sky/30 shadow-lg' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-1.5 rounded-full transition-colors ${
                    readingComplete ? 'bg-hygge-sky text-white' : 'bg-hygge-sky/20 text-hygge-moss'
                  }`}>
                    {readingComplete ? <Check size={12} /> : <BookOpen size={12} />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-hygge-moss">Reading</p>
                    <p className="text-xs text-hygge-earth/60">
                      {readingComplete ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Yoga Status */}
              <div className={`relative p-3 rounded-xl border transition-all duration-300 ${
                yogaComplete 
                  ? 'bg-hygge-stone/20 border-hygge-stone/30 shadow-lg' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`p-1.5 rounded-full transition-colors ${
                    yogaComplete ? 'bg-hygge-stone text-white' : 'bg-hygge-stone/20 text-hygge-moss'
                  }`}>
                    {yogaComplete ? <Check size={12} /> : <Flower2 size={12} />}
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-hygge-moss">Yoga</p>
                    <p className="text-xs text-hygge-earth/60">
                      {yogaComplete ? 'Complete' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bubble Buttons in Vertical Layout - Smaller Size */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-sm mx-auto">
          {/* Meditation Bubble */}
          <div 
            className="animate-float cursor-pointer group w-full"
            onClick={handleMeditate}
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-moss/30 to-hygge-sage/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Main bubble - smaller size */}
              <div className="relative w-56 h-56 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-moss/20 to-hygge-sage/10 opacity-50"></div>
                
                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-4 p-3 rounded-full bg-hygge-moss/20 backdrop-blur-sm group-hover:bg-hygge-moss/30 transition-all duration-300">
                    <Brain size={36} className="text-hygge-moss" />
                  </div>
                  <h3 className="font-display text-xl text-hygge-moss mb-2 font-semibold">Meditate</h3>
                  <p className="text-hygge-earth/80 text-xs leading-relaxed">Find your inner peace and clarity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Reading Bubble */}
          <div 
            className="animate-float cursor-pointer group w-full"
            onClick={handleTodaysReading}
            style={{ animationDelay: "1.2s" }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-sky/30 to-hygge-sage/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Main bubble - smaller size */}
              <div className="relative w-56 h-56 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-sky/20 to-hygge-stone/10 opacity-50"></div>
                
                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="mb-4 p-3 rounded-full bg-hygge-sky/20 backdrop-blur-sm group-hover:bg-hygge-sky/30 transition-all duration-300">
                    <BookOpen size={36} className="text-hygge-moss" />
                  </div>
                  <h3 className="font-display text-xl text-hygge-moss mb-2 font-semibold">Today's Reading</h3>
                  <p className="text-hygge-earth/80 text-xs leading-relaxed">Nourish your mind with wisdom</p>
                </div>
              </div>
            </div>
          </div>

          {/* Yoga for the Day Bubble */}
          <div 
            className="animate-float cursor-pointer group w-full"
            onClick={handleYoga}
            style={{ animationDelay: "1.8s" }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-stone/30 to-hygge-mist/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              {/* Main bubble - smaller size */}
              <div className="relative w-56 h-56 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 group-hover:bg-white/15">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-hygge-stone/20 to-hygge-mist/10 opacity-50"></div>
                
                {/* Content */}
                <div className="relative flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="mb-3 p-3 rounded-full bg-hygge-stone/20 backdrop-blur-sm group-hover:bg-hygge-stone/30 transition-all duration-300">
                    <Flower2 size={36} className="text-hygge-moss" />
                  </div>
                  <h3 className="font-display text-lg text-hygge-moss mb-3 font-semibold">Yoga for the Day</h3>
                  
                  {/* Yoga Technique Buttons */}
                  <div className="space-y-2 w-full">
                    <Button 
                      variant="plain" 
                      size="sm" 
                      className="w-full text-xs py-1 h-auto bg-white/20 border-hygge-stone/30 text-hygge-moss hover:bg-hygge-stone/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Pranayama practice started");
                      }}
                    >
                      Pranayama
                    </Button>
                    <Button 
                      variant="plain" 
                      size="sm" 
                      className="w-full text-xs py-1 h-auto bg-white/20 border-hygge-stone/30 text-hygge-moss hover:bg-hygge-stone/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Dharana practice started");
                      }}
                    >
                      Dharana
                    </Button>
                    <Button 
                      variant="plain" 
                      size="sm" 
                      className="w-full text-xs py-1 h-auto bg-white/20 border-hygge-stone/30 text-hygge-moss hover:bg-hygge-stone/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Dhyana practice started");
                      }}
                    >
                      Dhyana
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Call to Action at Bottom */}
        <div className="text-center pb-12 animate-fade-in" style={{ animationDelay: "2s" }}>
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
