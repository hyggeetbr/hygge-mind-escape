
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Star, Crown, Award, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Leaderboard = () => {
  const navigate = useNavigate();

  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "from-pink-400 to-rose-500",
      badge: "🏆",
      badgeTitle: "Community Champion",
      highlights: 347,
      contributions: 89,
      weeklyGrowth: "+12%",
      specialBadge: "crown"
    },
    {
      rank: 2,
      name: "Maya Patel",
      avatar: "from-green-400 to-emerald-500",
      badge: "🌟",
      badgeTitle: "Wisdom Keeper",
      highlights: 298,
      contributions: 72,
      weeklyGrowth: "+8%",
      specialBadge: "star"
    },
    {
      rank: 3,
      name: "Alex Rivera",
      avatar: "from-blue-400 to-cyan-500",
      badge: "💎",
      badgeTitle: "Mindful Guide",
      highlights: 276,
      contributions: 65,
      weeklyGrowth: "+15%",
      specialBadge: "diamond"
    },
    {
      rank: 4,
      name: "David Kim",
      avatar: "from-purple-400 to-violet-500",
      badge: "🎯",
      badgeTitle: "Focus Master",
      highlights: 234,
      contributions: 58,
      weeklyGrowth: "+6%",
      specialBadge: "medal"
    },
    {
      rank: 5,
      name: "Emma Thompson",
      avatar: "from-orange-400 to-red-500",
      badge: "✨",
      badgeTitle: "Inspiration Spark",
      highlights: 198,
      contributions: 51,
      weeklyGrowth: "+10%",
      specialBadge: "star"
    },
    {
      rank: 6,
      name: "James Wilson",
      avatar: "from-teal-400 to-blue-500",
      badge: "🧘",
      badgeTitle: "Zen Contributor",
      highlights: 167,
      contributions: 44,
      weeklyGrowth: "+4%",
      specialBadge: "medal"
    }
  ];

  const getSpecialIcon = (badge: string) => {
    switch (badge) {
      case "crown":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "star":
        return <Star className="w-4 h-4 text-yellow-400" />;
      case "diamond":
        return <Award className="w-4 h-4 text-blue-400" />;
      case "medal":
        return <Trophy className="w-4 h-4 text-orange-400" />;
      default:
        return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50";
      case 2:
        return "border-2 border-gray-300 bg-gradient-to-r from-gray-50 to-blue-50";
      case 3:
        return "border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-red-50";
      default:
        return "";
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSleep = () => {
    navigate("/sleep");
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/community")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Leaderboard</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-white text-3xl font-light mb-4">Top Contributors</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Celebrating our most inspiring community members and their meaningful contributions.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className={`w-16 h-16 bg-gradient-to-br ${leaderboardData[1].avatar} rounded-full flex items-center justify-center text-white font-bold text-lg mb-3`}>
                {leaderboardData[1].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="calm-card p-4 w-full text-center">
                <div className="text-2xl mb-1">🥈</div>
                <div className="font-semibold text-gray-800 text-sm">{leaderboardData[1].name}</div>
                <div className="text-calm-purple text-xs">{leaderboardData[1].highlights} highlights</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${leaderboardData[0].avatar} rounded-full flex items-center justify-center text-white font-bold text-xl mb-3 border-4 border-yellow-400`}>
                {leaderboardData[0].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="calm-card p-4 w-full text-center border-2 border-yellow-400">
                <div className="text-3xl mb-1">🏆</div>
                <div className="font-semibold text-gray-800">{leaderboardData[0].name}</div>
                <div className="text-calm-purple text-sm">{leaderboardData[0].highlights} highlights</div>
                <div className="text-xs text-yellow-600 font-medium mt-1">{leaderboardData[0].badgeTitle}</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className={`w-16 h-16 bg-gradient-to-br ${leaderboardData[2].avatar} rounded-full flex items-center justify-center text-white font-bold text-lg mb-3`}>
                {leaderboardData[2].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="calm-card p-4 w-full text-center">
                <div className="text-2xl mb-1">🥉</div>
                <div className="font-semibold text-gray-800 text-sm">{leaderboardData[2].name}</div>
                <div className="text-calm-purple text-xs">{leaderboardData[2].highlights} highlights</div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-white text-xl font-medium mb-4">Full Rankings</h3>
          <div className="space-y-3">
            {leaderboardData.map((member, index) => (
              <div 
                key={member.rank}
                className={`calm-card p-4 ${getRankStyle(member.rank)} transform transition-all duration-300 hover:scale-105`}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      member.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      member.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      member.rank === 3 ? 'bg-orange-300 text-orange-900' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {member.rank}
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-br ${member.avatar} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-800">{member.name}</h4>
                      <span className="text-lg">{member.badge}</span>
                      {getSpecialIcon(member.specialBadge)}
                    </div>
                    <div className="text-xs text-gray-600">{member.badgeTitle}</div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-3 mb-1">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-gray-700">{member.highlights}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-gray-700">{member.contributions}</span>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 font-medium">{member.weeklyGrowth}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="calm-card p-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Community Impact</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-calm-purple">1,847</div>
                <div className="text-xs text-gray-600">Total Highlights</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-calm-blue">423</div>
                <div className="text-xs text-gray-600">Active Contributors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-calm-orange">156</div>
                <div className="text-xs text-gray-600">Posts This Week</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={handleDashboard}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/60 rounded-sm"></div>
            </div>
            <span className="text-white/60 text-xs">Home</span>
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
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-calm-purple rounded-sm"></div>
            </div>
            <span className="text-white text-xs font-medium">Community</span>
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

export default Leaderboard;
