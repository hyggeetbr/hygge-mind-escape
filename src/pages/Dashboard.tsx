import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, Target, Trophy, Book, Music, Palette, Home, Users, Bot, Zap, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UsernameDialog } from "@/components/UsernameDialog";
import ThemeSelector from "@/components/ThemeSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [meditationMinutes, setMeditationMinutes] = useState(0);
  const [yogaMinutes, setYogaMinutes] = useState(0);
  const [readingMinutes, setReadingMinutes] = useState(0);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [background, setBackground] = useState("url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')");

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('username, theme_preference')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        if (profile && profile.username) {
          setUsername(profile.username);
        } else {
          setShowUsernameDialog(true);
        }

        // Fetch today's activity data from database
        const { data: dailyActivity, error: activityError } = await supabase
          .from('daily_activities')
          .select('meditation_minutes, yoga_minutes, reading_minutes')
          .eq('user_id', user.id)
          .eq('date', new Date().toISOString().split('T')[0])
          .single();

        if (dailyActivity) {
          setMeditationMinutes(dailyActivity.meditation_minutes || 0);
          setYogaMinutes(dailyActivity.yoga_minutes || 0);
          setReadingMinutes(dailyActivity.reading_minutes || 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleUsernameSet = async (newUsername: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ username: newUsername })
        .eq('id', user.id);

      if (error) {
        console.error("Error updating username:", error);
        toast({
          title: "Error",
          description: "Failed to update username. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setUsername(newUsername);
      setShowUsernameDialog(false);
      toast({
        title: "Success",
        description: "Username updated successfully!",
      });
    } catch (error) {
      console.error("Error setting username:", error);
      toast({
        title: "Error",
        description: "Failed to set username. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleThemeChange = (newBackground: string) => {
    setBackground(newBackground);
    document.body.style.backgroundImage = newBackground;
  };

  // Calculate progress percentages
  const meditationProgress = Math.min((meditationMinutes / 20) * 100, 100);
  const yogaProgress = Math.min((yogaMinutes / 30) * 100, 100);
  const readingProgress = Math.min((readingMinutes / 15) * 100, 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <span className="text-5xl text-gray-400 font-light">Hygge</span>
          </div>
          <span className="relative text-5xl text-gray-600 font-light animate-fade-in">Hygge</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden" style={{ backgroundImage: background }}>
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-white/4 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <div>
          <h1 className="text-gray-800 text-3xl font-light mb-1">
            Welcome, {username || "User"}!
          </h1>
          <p className="text-gray-600 text-sm">
            Your daily dose of calm and productivity
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/profile")}
          className="text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-full"
        >
          <User size={24} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Goals Overview with Circular Progress */}
        <Card className="mb-6 animate-fade-in glass-effect">
          <CardHeader>
            <CardTitle className="text-gray-800">Today's Goals</CardTitle>
            <CardDescription className="text-gray-600">
              Track your daily progress
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-6">
            {/* Meditation Progress Circle */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - meditationProgress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{Math.round(meditationProgress)}%</span>
                </div>
              </div>
              <Calendar className="w-4 h-4 text-orange-500 mb-1" />
              <h3 className="text-sm font-medium text-gray-800">Meditation</h3>
              <p className="text-xs text-gray-600">{meditationMinutes} / 20 min</p>
            </div>

            {/* Yoga Progress Circle */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - yogaProgress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{Math.round(yogaProgress)}%</span>
                </div>
              </div>
              <Target className="w-4 h-4 text-purple-500 mb-1" />
              <h3 className="text-sm font-medium text-gray-800">Yoga</h3>
              <p className="text-xs text-gray-600">{yogaMinutes} / 30 min</p>
            </div>

            {/* Reading Progress Circle */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4"/>
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - readingProgress / 100)}`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">{Math.round(readingProgress)}%</span>
                </div>
              </div>
              <Book className="w-4 h-4 text-blue-500 mb-1" />
              <h3 className="text-sm font-medium text-gray-800">Reading</h3>
              <p className="text-xs text-gray-600">{readingMinutes} / 15 min</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Activity Buttons - Horizontal Layout */}
        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in">
          <Card 
            className="bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 cursor-pointer border-orange-200 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/meditate")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Meditate</h3>
              <p className="text-sm text-gray-600">Find inner peace</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 cursor-pointer border-purple-200 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/yoga")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Yoga</h3>
              <p className="text-sm text-gray-600">Strengthen body</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 cursor-pointer border-blue-200 shadow-lg hover:shadow-xl"
            onClick={() => navigate("/todays-reading")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Reading</h3>
              <p className="text-sm text-gray-600">Expand knowledge</p>
            </CardContent>
          </Card>
        </div>

        {/* Get More From Hygge Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Get More From Hygge</h2>
          <Card 
            className="animate-fade-in bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 cursor-pointer border-green-200 shadow-lg hover:shadow-xl max-w-xs"
            onClick={() => navigate("/goal-setting")}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Set Goals</h3>
              <p className="text-sm text-gray-600">Define wellness objectives</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Inspiration */}
        <Card className="animate-fade-in glass-effect">
          <CardHeader>
            <CardTitle className="text-gray-800">Daily Inspiration</CardTitle>
            <CardDescription className="text-gray-600">
              A quote to brighten your day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg italic text-gray-700">
              "The mind is everything. What you think you become."
            </blockquote>
            <p className="text-sm text-gray-500">— Buddha</p>
          </CardContent>
        </Card>
      </div>

      {/* Theme Selector */}
      <ThemeSelector onThemeChange={handleThemeChange} />
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30">
        <div className="flex justify-around py-4 px-2">
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-800 text-xs font-medium">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Music className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Echo</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/pulse")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Zap className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Pulse</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Lumina</span>
          </div>
        </div>
      </div>

      <UsernameDialog 
        open={showUsernameDialog} 
        onClose={() => setShowUsernameDialog(false)}
        onUsernameSet={handleUsernameSet}
      />
    </div>
  );
};

export default Dashboard;
