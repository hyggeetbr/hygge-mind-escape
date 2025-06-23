
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GoalSetting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goalStats, setGoalStats] = useState({
    longTerm: { completed: 0, total: 0 },
    shortTerm: { completed: 0, total: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoalStats = async () => {
      if (!user) return;
      
      try {
        // Fetch long-term goals stats
        const { data: longTermGoals, error: ltError } = await supabase
          .from('long_term_goals')
          .select('is_completed')
          .eq('user_id', user.id);

        // Fetch short-term goals stats
        const { data: shortTermGoals, error: stError } = await supabase
          .from('short_term_goals')
          .select('is_completed')
          .eq('user_id', user.id);

        if (ltError) console.error('Error fetching long-term goals:', ltError);
        if (stError) console.error('Error fetching short-term goals:', stError);

        const longTermCompleted = longTermGoals?.filter(goal => goal.is_completed).length || 0;
        const shortTermCompleted = shortTermGoals?.filter(goal => goal.is_completed).length || 0;

        setGoalStats({
          longTerm: {
            completed: longTermCompleted,
            total: longTermGoals?.length || 0
          },
          shortTerm: {
            completed: shortTermCompleted,
            total: shortTermGoals?.length || 0
          }
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalStats();
  }, [user]);

  const calculatePercentage = (completed: number, total: number) => {
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const longTermPercentage = calculatePercentage(goalStats.longTerm.completed, goalStats.longTerm.total);
  const shortTermPercentage = calculatePercentage(goalStats.shortTerm.completed, goalStats.shortTerm.total);

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
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-white text-3xl font-light mb-1">Goal Setting Dashboard</h1>
            <p className="text-white/60 text-sm">Track your progress and set new goals</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Progress Overview */}
        <div className="calm-card p-6 mb-6 animate-fade-in">
          <h2 className="text-2xl font-medium mb-6 text-black text-center">Your Progress</h2>
          
          {loading ? (
            <div className="text-center text-gray-500">Loading progress...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Long Term Progress */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#8b45ff"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - longTermPercentage / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold text-calm-purple">{longTermPercentage}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-black mb-1">Long Term Goals</h3>
                <p className="text-gray-500 text-sm">{goalStats.longTerm.completed}/{goalStats.longTerm.total} completed</p>
              </div>

              {/* Short Term Progress */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - shortTermPercentage / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-semibold text-calm-blue">{shortTermPercentage}%</span>
                  </div>
                </div>
                <h3 className="font-medium text-black mb-1">Short Term Goals</h3>
                <p className="text-gray-500 text-sm">{goalStats.shortTerm.completed}/{goalStats.shortTerm.total} completed</p>
              </div>
            </div>
          )}
        </div>

        {/* Goal Setting Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div
            className="calm-card p-8 cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/long-term-goals")}
          >
            <div className="text-center">
              <Target className="w-12 h-12 text-calm-purple mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-3 text-black">Long Term Goal Setting</h3>
              <p className="text-gray-500 mb-4">Set and track your long-term aspirations and major life goals.</p>
              <Button className="bg-calm-purple hover:bg-calm-purple/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Manage Goals
              </Button>
            </div>
          </div>

          <div
            className="calm-card p-8 cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/short-term-goals")}
          >
            <div className="text-center">
              <Calendar className="w-12 h-12 text-calm-blue mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-3 text-black">Short Term Goal Setting</h3>
              <p className="text-gray-500 mb-4">Plan and achieve your immediate objectives and weekly tasks.</p>
              <Button className="bg-calm-blue hover:bg-calm-blue/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Manage Goals
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalSetting;
