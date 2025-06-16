import { useState } from "react";
import HomeButton from "@/components/HomeButton";
import { supabase } from "@/integrations/supabase/client";

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: { question },
      });
      if (error) {
        console.error('ask-ai error:', error);
        setAnswer('Error contacting AI.');
        return;
      }
      const text = (data as { answer?: string }).answer;
      setAnswer(text || 'No response.');
    } catch (err) {
      console.error(err);
      setAnswer("Error contacting AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center bg-hygge-cream">
      <HomeButton />
      <div className="w-full max-w-md mx-auto mt-20 px-4 pb-12">
        <h1 className="font-display text-2xl text-hygge-moss mb-4 text-center">Ask from AI</h1>
        <textarea
          className="w-full h-24 p-3 border border-hygge-stone/40 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-hygge-sky"
          placeholder="Ask your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-hygge-moss text-hygge-cream hover:bg-hygge-sage transition"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
        {answer && (
          <div className="mt-6 p-4 bg-white/80 border border-hygge-stone/30 rounded-lg shadow">
            <p className="text-hygge-earth whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;
