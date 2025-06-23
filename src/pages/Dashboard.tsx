
import { useNavigate } from "react-router-dom";
import { CalendarDays, ListChecks, Sparkles, BookOpen, User, Home, Users, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handlePremium = () => {
    navigate("/premium");
  };

  const handleGoalSetting = () => {
    navigate("/goal-setting");
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
          <h1 className="text-white text-3xl font-light mb-1">Hygge - Escape the Brainrot</h1>
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
        {/* Task Completion Tracker */}
        <div className="calm-card p-6 mb-6 animate-fade-in">
          <h2 className="text-2xl font-medium mb-6 text-black text-center">Today's Progress</h2>
          
          {loading ? (
            <div className="text-center text-gray-500">Loading progress...</div>
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
                      stroke="#e5e7eb"
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
                    <span className="text-lg font-semibold text-calm-purple">{taskCompletion.meditation}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-black mb-1">Meditation</h3>
                <p className="text-gray-500 text-sm">{dailyProgress.meditation}/{goals.meditation} min</p>
              </div>

              {/* Yoga Progress */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#e5e7eb"
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
                    <span className="text-lg font-semibold text-calm-blue">{taskCompletion.yoga}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-black mb-1">Yoga</h3>
                <p className="text-gray-500 text-sm">{dailyProgress.yoga}/{goals.yoga} min</p>
              </div>

              {/* Reading Progress */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#e5e7eb"
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
                    <span className="text-lg font-semibold text-calm-orange">{taskCompletion.reading}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-black mb-1">Reading</h3>
                <p className="text-gray-500 text-sm">{dailyProgress.reading}/{goals.reading} min</p>
              </div>
            </div>
          )}
        </div>

        {/* Your Tasks Section */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-medium mb-6 text-center">Your Tasks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div
              className="calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleMeditate}
            >
              <div className="text-center">
                <Sparkles className="w-8 h-8 text-calm-purple mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2 text-black">Meditate</h3>
                <p className="text-gray-500">Find your inner peace with guided meditation.</p>
              </div>
            </div>

            <div
              className="calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleYoga}
            >
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-calm-blue mx-auto mb-4"
                >
                  <path d="M4 4v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2V4"/>
                  <path d="M4 12v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2v-4"/>
                  <path d="M4 20v-2c0-1.5 1-2 2.5 2h0c1.5 0 2.5.5 2.5 2v2"/>
                  <path d="M12 4v16"/>
                  <path d="M12 12H20"/>
                  <path d="M16 8v8"/>
                </svg>
                <h3 className="text-xl font-medium mb-2 text-black">Yoga</h3>
                <p className="text-gray-500">Rejuvenate your body and mind with yoga sessions.</p>
              </div>
            </div>

            <div
              className="calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleTodaysReading}
            >
              <div className="text-center">
                <BookOpen className="w-8 h-8 text-calm-orange mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2 text-black">Read</h3>
                <p className="text-gray-500">Enlighten your mind with today's curated article.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Get more from Hygge Section */}
        <div>
          <h2 className="text-white text-2xl font-medium mb-6 text-center">Get more from Hygge</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 max-w-md mx-auto">
            <div 
              className="calm-card p-6 animate-fade-in cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={handleGoalSetting}
            >
              <div className="text-center">
                <ListChecks className="w-8 h-8 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-black mb-2">Goal Setting</h3>
                <p className="text-gray-500">Set and achieve your personal growth goals.</p>
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
              <Home className="w-4 h-4 text-calm-purple" />
            </div>
            <span className="text-white text-xs font-medium">Home</span>
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
