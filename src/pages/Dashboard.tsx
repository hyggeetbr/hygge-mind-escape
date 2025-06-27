import { useNavigate } from "react-router-dom";
import { CalendarDays, ListChecks, Sparkles, BookOpen, User, Home, Users, Bot, Music } from "lucide-react";
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

  const handleGoalSetting = () => {
    navigate("/goal-setting");
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
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
        <div 
          className="relative p-6 mb-6 animate-fade-in rounded-2xl border border-white/20 shadow-lg overflow-hidden"
          style={{
            backgroundImage: 'url(/lovable-uploads/e2976cc5-aa4b-451c-bff1-6ae1cfbbe16f.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-medium mb-6 text-white text-center">Today's Progress</h2>
            
            {loading ? (
              <div className="text-center text-white/70">Loading progress...</div>
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
                        stroke="rgba(255,255,255,0.3)"
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
                      <span className="text-lg font-semibold text-white">{taskCompletion.meditation}%</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-white mb-1">Meditation</h3>
                  <p className="text-white/70 text-sm">{dailyProgress.meditation}/{goals.meditation} min</p>
                </div>

                {/* Yoga Progress */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(255,255,255,0.3)"
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
                      <span className="text-lg font-semibold text-white">{taskCompletion.yoga}%</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-white mb-1">Yoga</h3>
                  <p className="text-white/70 text-sm">{dailyProgress.yoga}/{goals.yoga} min</p>
                </div>

                {/* Reading Progress */}
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(255,255,255,0.3)"
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
                      <span className="text-lg font-semibold text-white">{taskCompletion.reading}%</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-white mb-1">Reading</h3>
                  <p className="text-white/70 text-sm">{dailyProgress.reading}/{goals.reading} min</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Your Tasks Section */}
        <div className="mb-8">
          <h2 className="text-white text-2xl font-medium mb-6 text-center">Your Tasks</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div
              className="relative p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 rounded-2xl border border-white/30 shadow-2xl overflow-hidden"
              onClick={handleMeditate}
              style={{
                backgroundImage: 'url(/lovable-uploads/d17b2fe6-8631-425c-b185-9aba3b38c6ba.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-light mb-3 text-white tracking-wide">Meditate</h3>
                <p className="text-white/90 text-sm font-light leading-relaxed">Find your inner peace with guided meditation sessions</p>
              </div>
            </div>

            <div
              className="relative p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 rounded-2xl border border-white/30 shadow-2xl overflow-hidden"
              onClick={handleYoga}
              style={{
                backgroundImage: 'url(/lovable-uploads/d17b2fe6-8631-425c-b185-9aba3b38c6ba.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
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
                    className="text-white"
                  >
                    <path d="M4 4v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2V4"/>
                    <path d="M4 12v4c0 1.5 1 2 2.5 2h0c1.5 0 2.5-.5 2.5-2v-4"/>
                    <path d="M4 20v-2c0-1.5 1-2 2.5 2h0c1.5 0 2.5.5 2.5 2v2"/>
                    <path d="M12 4v16"/>
                    <path d="M12 12H20"/>
                    <path d="M16 8v8"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-light mb-3 text-white tracking-wide">Yoga</h3>
                <p className="text-white/90 text-sm font-light leading-relaxed">Rejuvenate your body and mind with yoga practices</p>
              </div>
            </div>

            <div
              className="relative p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 rounded-2xl border border-white/30 shadow-2xl overflow-hidden"
              onClick={handleTodaysReading}
              style={{
                backgroundImage: 'url(/lovable-uploads/d17b2fe6-8631-425c-b185-9aba3b38c6ba.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-light mb-3 text-white tracking-wide">Read</h3>
                <p className="text-white/90 text-sm font-light leading-relaxed">Enlighten your mind with today's curated articles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Get more from Hygge Section */}
        <div>
          <h2 className="text-white text-2xl font-medium mb-6 text-center">Get more from Hygge</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-1 max-w-md mx-auto">
            <div 
              className="relative p-6 animate-fade-in cursor-pointer transform transition-all duration-300 hover:scale-105 rounded-2xl border border-white/20 shadow-lg overflow-hidden"
              onClick={handleGoalSetting}
              style={{
                backgroundImage: 'url(/lovable-uploads/12022cf2-d56b-4835-b30b-084e5d3cbb56.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
              <div className="relative z-10 text-center">
                <ListChecks className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Goal Setting</h3>
                <p className="text-white/80">Set and achieve your personal growth goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Removed Premium */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-black" />
            </div>
            <span className="text-white text-xs font-medium">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDiscover}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Music className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Echo</span>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
