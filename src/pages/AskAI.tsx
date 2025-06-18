
import { useState } from "react";
import HomeButton from "@/components/HomeButton";

const AskAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      console.log("API Key exists:", !!apiKey);
      
      if (!apiKey) {
        setAnswer("OpenAI key not configured.");
        return;
      }
      
      console.log("Making request to OpenAI...");
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for a mindfulness app.",
            },
            { role: "user", content: question },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        setAnswer(`Error: ${res.status} - ${errorText}`);
        return;
      }
      
      const data = await res.json();
      console.log("Full API response:", data);
      
      const text = data.choices?.[0]?.message?.content;
      console.log("Extracted text:", text);
      
      if (text) {
        setAnswer(text.trim());
      } else {
        console.error("No content in response:", data);
        setAnswer("Error: No response content received from AI.");
      }
    } catch (err) {
      console.error("Request failed:", err);
      setAnswer(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
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
