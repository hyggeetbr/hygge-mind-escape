
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AskAI = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      console.log("Calling ask-ai edge function...");
      
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: { question: question.trim() }
      });

      console.log("Edge function response:", { data, error });

      if (error) {
        console.error("Edge function error:", error);
        setAnswer(`Error: ${error.message || 'Failed to get response from AI'}`);
        return;
      }

      if (data?.answer) {
        setAnswer(data.answer);
      } else if (data?.error) {
        setAnswer(`Error: ${data.error}`);
      } else {
        console.error("Unexpected response format:", data);
        setAnswer("Error: Unexpected response format from server");
      }
    } catch (err) {
      console.error("Request failed:", err);
      setAnswer(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
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
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-white text-xl font-medium">Ask AI</div>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-24">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-white text-2xl font-light mb-2">
            Ask from AI
          </h1>
          <p className="text-white/60 text-sm">
            Get mindful guidance and wisdom
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="calm-card p-1 flex items-center">
            <div className="flex-1 flex items-center">
              <div className="text-gray-400 ml-3">🔍</div>
              <input
                type="text"
                placeholder="Ask your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="flex-1 px-3 py-3 bg-transparent border-0 outline-none text-gray-800 placeholder-gray-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              />
            </div>
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="w-10 h-10 rounded-full bg-calm-purple text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-calm-purple/90 transition-all mr-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Answer Section */}
        {answer && (
          <div className="mb-8 animate-fade-in">
            <h2 className="text-white text-lg font-medium mb-4">Response</h2>
            <div className="calm-card p-4">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {answer}
              </div>
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {!answer && !loading && (
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-white text-lg font-medium mb-4">Popular Questions</h2>
            
            <div className="space-y-3">
              {[
                "How can I find inner peace?",
                "What is the best way to start meditating?",
                "How do I deal with stress and anxiety?",
                "What are some mindfulness techniques?",
                "How can I improve my sleep quality?"
              ].map((suggestedQuestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggestedQuestion)}
                  className="w-full calm-card p-4 text-left text-gray-800 hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span>{suggestedQuestion}</span>
                    <div className="text-gray-400">›</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="grid grid-cols-3 gap-4">
            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-blue/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-blue text-xl">🧠</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">Mindful Tools</div>
            </div>

            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-purple/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-purple text-xl">⭐</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">Videos</div>
            </div>

            <div className="calm-card p-4 text-center">
              <div className="w-12 h-12 bg-calm-orange/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-calm-orange text-xl">✍️</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">Reflections</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="flex justify-around py-3">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">🏠</div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">🌙</div>
            <span className="text-white/60 text-xs">Sleep</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-calm-purple rounded-sm"></div>
            </div>
            <span className="text-white text-xs font-medium">Discover</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">👤</div>
            <span className="text-white/60 text-xs">Profile</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 text-white/60">⭐</div>
            <span className="text-white/60 text-xs">Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAI;
