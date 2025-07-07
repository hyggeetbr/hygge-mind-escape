
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music, Zap, TrendingUp, Activity, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Pulse = () => {
  const navigate = useNavigate();

  const pulseItems = [
    {
      id: 1,
      title: "Weekly Meditation Challenge",
      description: "Join thousands of users in our weekly meditation challenge. Track your progress and earn rewards.",
      category: "Challenge",
      participants: 1247,
      icon: <Activity className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Mindfulness Trends",
      description: "Discover the latest trends in mindfulness and meditation practices around the world.",
      category: "Trending",
      participants: 892,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      id: 3,
      title: "Community Wellness",
      description: "See how our community is growing stronger together with shared wellness goals.",
      category: "Community",
      participants: 2156,
      icon: <Heart className="w-6 h-6" />,
      color: "bg-red-500"
    },
    {
      id: 4,
      title: "Achievement Unlocked",
      description: "Celebrate your milestones and achievements in your wellness journey.",
      category: "Achievement",
      participants: 634,
      icon: <Award className="w-6 h-6" />,
      color: "bg-purple-500"
    },
    {
      id: 5,
      title: "Daily Insights",
      description: "Get personalized insights based on your meditation and wellness activities.",
      category: "Insight",
      participants: 1789,
      icon: <Zap className="w-6 h-6" />,
      color: "bg-yellow-500"
    },
    {
      id: 6,
      title: "Yoga Flow Sessions",
      description: "Join live yoga flow sessions with certified instructors from around the globe.",
      category: "Live Session",
      participants: 543,
      icon: <Activity className="w-6 h-6" />,
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
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
          className="text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-gray-800 text-xl font-medium">Pulse</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="mb-6">
          <h2 className="text-gray-800 text-2xl font-bold mb-2">Community Pulse</h2>
          <p className="text-gray-600">Stay connected with the latest trends and activities in our wellness community</p>
        </div>

        {/* Pulse Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pulseItems.map((item) => (
            <Card key={item.id} className="bg-white/95 backdrop-blur-md border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${item.color} text-white`}>
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <CardTitle className="text-gray-800 text-lg">{item.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{item.participants.toLocaleString()} participants</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    size="sm"
                  >
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-white/95 backdrop-blur-md rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-800 text-xl font-bold mb-4">Community Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">12.5K</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">45.2K</div>
              <div className="text-sm text-gray-600">Sessions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">8.7K</div>
              <div className="text-sm text-gray-600">Hours Meditated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">156</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Home className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-gray-400 text-xs">Home</span>
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
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-800 text-xs font-medium">Pulse</span>
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
    </div>
  );
};

export default Pulse;
