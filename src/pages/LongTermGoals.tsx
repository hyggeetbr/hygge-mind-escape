import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ThemeSelector from "@/components/ThemeSelector";

interface LongTermGoal {
  id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

const LongTermGoals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<LongTermGoal[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentBackground, setCurrentBackground] = useState("radial-gradient(circle at 20% 50%, #120a8f 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%), radial-gradient(circle at 40% 80%, #7c3aed 0%, transparent 50%), linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)");

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('long_term_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: "Error",
          description: "Failed to fetch goals",
          variant: "destructive",
        });
        return;
      }

      setGoals(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    if (!user || !newGoal.trim()) return;
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('long_term_goals')
        .insert([
          {
            user_id: user.id,
            title: newGoal.trim(),
            is_completed: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding goal:', error);
        toast({
          title: "Error",
          description: "Failed to add goal",
          variant: "destructive",
        });
        return;
      }

      setGoals([data, ...goals]);
      setNewGoal("");
      toast({
        title: "Success",
        description: "Goal added successfully",
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleGoalCompletion = async (goalId: string, currentStatus: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('long_term_goals')
        .update({ is_completed: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating goal:', error);
        toast({
          title: "Error",
          description: "Failed to update goal",
          variant: "destructive",
        });
        return;
      }

      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, is_completed: !currentStatus }
          : goal
      ));

      toast({
        title: "Success",
        description: `Goal marked as ${!currentStatus ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) {
      addGoal();
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: currentBackground }}
    >
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
            onClick={() => navigate("/goal-setting")}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-white text-3xl font-light mb-1">Long Term Goals</h1>
            <p className="text-white/60 text-sm">Set and track your long-term aspirations</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Add New Goal */}
        <div className="calm-card p-6 mb-6 animate-fade-in">
          <h2 className="text-xl font-medium mb-4 text-black">Add New Goal</h2>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter your long-term goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-black bg-white border-gray-300 placeholder:text-black"
              disabled={submitting}
            />
            <Button 
              onClick={addGoal}
              disabled={!newGoal.trim() || submitting}
              className="bg-calm-purple hover:bg-calm-purple/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </div>

        {/* Goals List */}
        <div className="calm-card p-6 animate-fade-in">
          <h2 className="text-xl font-medium mb-6 text-black">Your Long Term Goals</h2>
          
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No long-term goals yet.</p>
              <p className="text-sm mt-2">Add your first goal above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <button
                    onClick={() => toggleGoalCompletion(goal.id, goal.is_completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal.is_completed
                        ? 'bg-calm-purple border-calm-purple text-white'
                        : 'border-gray-300 hover:border-calm-purple'
                    }`}
                  >
                    {goal.is_completed && <Check className="w-4 h-4" />}
                  </button>
                  <span
                    className={`flex-1 text-black ${
                      goal.is_completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {goal.title}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(goal.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Theme Selector */}
      <ThemeSelector onThemeChange={setCurrentBackground} />
    </div>
  );
};

export default LongTermGoals;
