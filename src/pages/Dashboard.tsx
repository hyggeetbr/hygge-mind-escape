
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Calendar, Target, Trophy, Book, Music, Palette, Home, Users, Bot, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UsernameDialog } from "@/components/UsernameDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [meditationMinutes, setMeditationMinutes] = useState(0);
  const [yogaMinutes, setYogaMinutes] = useState(0);
  const [readingMinutes, setReadingMinutes] = useState(0);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('username')
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

        // Fetch dummy data for meditation, yoga, and reading
        setMeditationMinutes(Math.floor(Math.random() * 60));
        setYogaMinutes(Math.floor(Math.random() * 60));
        setReadingMinutes(Math.floor(Math.random() * 60));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center calm-gradient">
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <span className="text-5xl text-white/30 font-light">Hygge</span>
          </div>
          <span className="relative text-5xl text-white font-light animate-fade-in">Hygge</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen calm-gradient relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-white/4 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 p-6">
        <h1 className="text-white text-3xl font-light mb-1">
          Welcome, {username || "User"}!
        </h1>
        <p className="text-white/60 text-sm">
          Your daily dose of calm and productivity
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Goals Overview */}
        <Card className="mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-black">Today's Goals</CardTitle>
            <CardDescription className="text-gray-500">
              Track your daily progress
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-black">Meditation</h3>
                <p className="text-xs text-gray-500">
                  {meditationMinutes} / 20 minutes
                </p>
                <Progress
                  value={meditationMinutes}
                  max={20}
                  className="h-2 rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Target className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-black">Yoga</h3>
                <p className="text-xs text-gray-500">{yogaMinutes} / 30 minutes</p>
                <Progress
                  value={yogaMinutes}
                  max={30}
                  className="h-2 rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Book className="w-5 h-5 text-gray-500" />
              <div>
                <h3 className="text-sm font-medium text-black">Reading</h3>
                <p className="text-xs text-gray-500">{readingMinutes} / 15 minutes</p>
                <Progress
                  value={readingMinutes}
                  max={15}
                  className="h-2 rounded-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in">
          <Card 
            className="bg-calm-orange/10 hover:bg-calm-orange/20 transition-colors cursor-pointer"
            onClick={() => navigate("/meditate")}
          >
            <CardHeader>
              <CardTitle className="text-black flex items-center text-sm">
                <Calendar className="mr-2 w-4 h-4" />
                Meditate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">Start your meditation session</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-calm-purple/10 hover:bg-calm-purple/20 transition-colors cursor-pointer"
            onClick={() => navigate("/yoga")}
          >
            <CardHeader>
              <CardTitle className="text-black flex items-center text-sm">
                <Target className="mr-2 w-4 h-4" />
                Yoga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">Practice yoga poses</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-calm-blue/10 hover:bg-calm-blue/20 transition-colors cursor-pointer"
            onClick={() => navigate("/todays-reading")}
          >
            <CardHeader>
              <CardTitle className="text-black flex items-center text-sm">
                <Book className="mr-2 w-4 h-4" />
                Reading
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">Read today's articles</p>
            </CardContent>
          </Card>

          <Card 
            className="bg-calm-green/10 hover:bg-calm-green/20 transition-colors cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <CardHeader>
              <CardTitle className="text-black flex items-center text-sm">
                <Palette className="mr-2 w-4 h-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600">Customize your profile</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Inspiration */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-black">Daily Inspiration</CardTitle>
            <CardDescription className="text-gray-500">
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
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 text-black" />
            </div>
            <span className="text-white text-xs font-medium">Home</span>
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
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/pulse")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white/60 text-xs">Pulse</span>
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

      <UsernameDialog 
        open={showUsernameDialog} 
        onClose={() => setShowUsernameDialog(false)}
        onUsernameSet={handleUsernameSet}
      />
    </div>
  );
};

export default Dashboard;
