
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Settings, Award, Calendar, Clock, Heart, Home, Users, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('meditation_minutes, yoga_minutes, reading_minutes, achievements_count')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        
        setUserProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const stats = [
    { 
      label: "Meditation Minutes", 
      value: userProfile?.meditation_minutes || "0", 
      icon: Calendar, 
      color: "text-calm-orange" 
    },
    { 
      label: "Yoga Minutes", 
      value: userProfile?.yoga_minutes || "0", 
      icon: Clock, 
      color: "text-calm-purple" 
    },
    { 
      label: "Reading Minutes", 
      value: userProfile?.reading_minutes || "0", 
      icon: Heart, 
      color: "text-pink-500" 
    }
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleAskAI = () => {
    navigate("/ask-ai");
  };

  const handlePremium = () => {
    navigate("/premium");
  };

  const handlePrivacy = () => {
    navigate("/privacy");
  };

  const handleSupport = () => {
    navigate("/support");
  };

  if (loading) {
    return (
      <div className="min-h-screen calm-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
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
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Profile</h1>
        <Button variant="ghost" size="icon" className="text-white/80 hover:bg-white/10 hover:text-white">
          <Settings size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Profile Info */}
        <div className="mb-8 animate-fade-in">
          <div className="calm-card p-6 text-center">
            <div className="w-20 h-20 bg-calm-purple rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {user?.email?.split('@')[0] || 'Mindful User'}
            </h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <div className="text-calm-purple text-sm font-medium">
              Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Your Journey</h3>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <div key={stat.label} className="calm-card p-4 text-center">
                <div className={`w-8 h-8 mx-auto mb-2 ${stat.color}`}>
                  <stat.icon className="w-full h-full" />
                </div>
                <div className="font-semibold text-gray-800 text-lg mb-1">{stat.value}</div>
                <div className="text-gray-600 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Achievements</h3>
          <div className="calm-card p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">Build streaks to get your first achievement!</p>
          </div>
        </div>

        {/* Settings */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Settings</h3>
          <div className="space-y-3">
            <div className="calm-card p-4 cursor-pointer" onClick={handlePrivacy}>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">Privacy</span>
                <div className="text-gray-400">›</div>
              </div>
            </div>
            <div className="calm-card p-4 cursor-pointer" onClick={handleSupport}>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">Help & Support</span>
                <div className="text-gray-400">›</div>
              </div>
            </div>
            <div className="calm-card p-4 cursor-pointer" onClick={handleLogout}>
              <div className="flex items-center justify-between">
                <span className="text-red-600 font-medium">Sign Out</span>
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

export default Profile;
