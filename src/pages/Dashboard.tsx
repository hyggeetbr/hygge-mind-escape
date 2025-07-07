
import { useNavigate } from "react-router-dom";
import { CalendarDays, ListChecks, Sparkles, BookOpen, User, Home, Users, Bot, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ThemeSelector from "@/components/ThemeSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentBackground, setCurrentBackground] = useState("url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')");
  const [dailyProgress, setDailyProgress] = useState({
    meditation: 0,
    yoga: 0,
    reading: 0
  });
  const [loading, setLoading] = useState(true);

  // Daily goals in minutes
  const goals = {
    meditation: 7,
    yoga: 10,
    reading: 10
  };

  // Calculate completion percentages
  const taskCompletion = {
    meditation: Math.min(Math.round((dailyProgress.meditation / goals.meditation) * 100), 100),
    yoga: Math.min(Math.round((dailyProgress.yoga / goals.yoga) * 100), 100),
    reading: Math.min(Math.round((dailyProgress.reading / goals.reading) * 100), 100)
  };

  // Fetch today's progress
  useEffect(() => {
    const fetchDailyProgress = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('daily_activities')
          .select('meditation_minutes, yoga_minutes, reading_minutes')
          .eq('user_id', user.id)
          .eq('date', new Date().toISOString().split('T')[0])
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching daily progress:', error);
          return;
        }
        
        if (data) {
          setDailyProgress({
            meditation: data.meditation_minutes || 0,
            yoga: data.yoga_minutes || 0,
            reading: data.reading_minutes || 0
          });
        } else {
          // No record for today yet, start with zeros
          setDailyProgress({
            meditation: 0,
            yoga: 0,
            reading: 0
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyProgress();
  }, [user]);

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

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleGoalSetting = () => {
    navigate("/goal-setting");
  };

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
        <div>
          <h1 className="text-botanical-text-dark text-3xl font-light mb-1">Hygge - Escape the Brainrot</h1>
          <p className="text-botanical-text-medium text-sm">Here is your mindful guidance for today.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleProfile}
          className="text-botanical-text-dark border-botanical-purple/30 bg-white/70 hover:bg-white/90"
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Task Completion Tracker */}
        <div className="calm-card p-6 mb-6 animate-fade-in">
          <h2 className="text-2xl font-medium mb-6 text-botanical-text-dark text-center">Today's Progress</h2>
          
          {loading ? (
            <div className="text-center text-botanical-text-medium">Loading progress...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Meditation Progress */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="rgba(139, 118, 147, 0.3)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#8b45ff"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - taskCompletion.meditation / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-botanical-text-dark">{taskCompletion.meditation}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-botanical-text-dark mb-1">Meditation</h3>
                <p className="text-botanical-text-medium text-sm">{dailyProgress.meditation}/{goals.meditation} min</p>
              </div>

              {/* Yoga Progress */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="rgba(139, 118, 147, 0.3)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - taskCompletion.yoga / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-botanical-text-dark">{taskCompletion.yoga}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-botanical-text-dark mb-1">Yoga</h3>
                <p className="text-botanical-text-medium text-sm">{dailyProgress.yoga}/{goals.yoga} min</p>
              </div>

              {/* Reading Progress */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="rgba(139, 118, 147, 0.3)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#fb9260"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - taskCompletion.reading / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-botanical-text-dark">{taskCompletion.reading}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-botanical-text-dark mb-1">Reading</h3>
                <p className="text-botanical-text-medium text-sm">{dailyProgress.reading}/{goals.reading} min</p>
              </div>
            </div>
          )}
        </div>

        {/* Your Tasks Section */}
        <div className="mb-8">
          <h2 className="text-botanical-text-dark text-2xl font-medium mb-6 text-center">Your Tasks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div
              className="calm-card p-8 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleMeditate}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-botanical-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-6 h-6 text-botanical-purple" />
                </div>
                <h3 className="text-2xl font-light mb-3 text-botanical-text-dark tracking-wide">Meditate</h3>
                <p className="text-botanical-text-medium text-sm font-light leading-relaxed">Find your inner peace with guided meditation sessions</p>
              </div>
            </div>

            <div
              className="calm-card p-8 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleYoga}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
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
                    className="text-blue-500"
                  >
                    <path d="M4 4v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2V4"/>
                    <path d="M4 12v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2v-4"/>
                    <path d="M4 20v-2c0-1.5 1-2 2.5 2h0c1.5 0 2.5.5 2.5 2v2"/>
                    <path d="M12 4v16"/>
                    <path d="M12 12H20"/>
                    <path d="M16 8v8"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-light mb-3 text-botanical-text-dark tracking-wide">Yoga</h3>
                <p className="text-botanical-text-medium text-sm font-light leading-relaxed">Rejuvenate your body and mind with yoga practices</p>
              </div>
            </div>

            <div
              className="calm-card p-8 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleTodaysReading}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-2xl font-light mb-3 text-botanical-text-dark tracking-wide">Read</h3>
                <p className="text-botanical-text-medium text-sm font-light leading-relaxed">Enlighten your mind with today's curated articles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Get more from Hygge Section */}
        <div>
          <h2 className="text-botanical-text-dark text-2xl font-medium mb-6 text-center">Get more from Hygge</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 max-w-md mx-auto">
            <div 
              className="calm-card p-6 animate-fade-in cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleGoalSetting}
            >
              <div className="text-center">
                <ListChecks className="w-8 h-8 text-botanical-purple mx-auto mb-4" />
                <h3 className="text-xl font-medium text-botanical-text-dark mb-2">Goal Setting</h3>
                <p className="text-botanical-text-medium">Set and achieve your personal growth goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-botanical-purple/30 z-30">
        <div className="flex justify-around py-4 px-2">
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-botanical-purple rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-botanical-text-dark text-xs font-medium">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDiscover}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Music className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleCommunity}
          >
            <div className="w-6 h-6 text-botanical-text-light flex items-center justify-center">
              <Users className="w-4 h-4 text-botanical-text-light" />
            </div>
            <span className="text-botanical-text-light text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleAskAI}
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

export default Dashboard;
