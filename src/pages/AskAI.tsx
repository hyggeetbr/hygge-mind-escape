
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, Home, Users, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useChatHistory } from "@/hooks/useChatHistory";
import { ChatSidebar } from "@/components/ChatSidebar";
import { useAuth } from "@/hooks/useAuth";

const AskAI = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const {
    sessions,
    currentSessionId,
    messages,
    loadMessages,
    createNewSession,
    saveMessage,
    deleteSession,
    startNewConversation,
    setMessages
  } = useChatHistory();

  // Set initial conversation with welcome message
  useEffect(() => {
    if (!currentSessionId && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: "assistant",
          content: "Hello! I'm Lumina, your personal mindfulness companion. How can I help you today? I can assist with meditation guidance, stress management techniques, sleep improvement tips, and more.",
          created_at: new Date().toISOString()
        }
      ]);
    }
  }, [currentSessionId, messages.length, setMessages]);

  const handleSend = async () => {
    if (!message.trim() || isLoading || !user) return;

    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);

    try {
      let sessionId = currentSessionId;
      
      // Create new session if we don't have one
      if (!sessionId) {
        sessionId = await createNewSession(userMessage);
        if (!sessionId) {
          throw new Error("Failed to create chat session");
        }
      }

      // Add user message to UI immediately
      const tempUserMessage = {
        id: `temp-user-${Date.now()}`,
        role: "user" as const,
        content: userMessage,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), tempUserMessage]);

      // Save user message to database
      await saveMessage(sessionId, "user", userMessage);

      // Call AI API
      const { data, error } = await supabase.functions.invoke("ask-ai", {
        body: { question: userMessage },
      });

      if (error) {
        throw new Error(error.message || "Unknown error from Backend");
      }

      if (!data || data.error) {
        throw new Error(data?.error || "No response from AI");
      }

      // Add AI response to UI
      const tempAiMessage = {
        id: `temp-ai-${Date.now()}`,
        role: "assistant" as const,
        content: data.answer,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempAiMessage]);

      // Save AI response to database
      await saveMessage(sessionId, "assistant", data.answer);

    } catch (error) {
      console.error('Error calling AI:', error);
      toast({
        title: "Error",
        description: "Sorry, I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to conversation
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: "assistant" as const,
        content: "Hmm, I'm having trouble responding right now. Please try again later.",
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    loadMessages(sessionId);
  };

  const handleNewChat = () => {
    startNewConversation();
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

  const handlePremium = () => {
    navigate("/premium");
  };

  return (
    <div className="min-h-screen calm-gradient relative overflow-hidden flex">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-white/4 rounded-full blur-lg" />
      </div>

      {/* Chat Sidebar */}
      {user && (
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onDeleteSession={deleteSession}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
          <h1 className="text-white text-xl font-medium">Ask Lumina</h1>
          <div className="w-10"></div>
        </div>

        {/* Chat Content */}
        <div className="relative z-10 flex-1 px-6 pb-32 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Welcome Header (only show when no current session or messages are empty) */}
            {(!currentSessionId || messages.length <= 1) && (
              <div className="text-center mb-8 animate-fade-in">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-white text-3xl font-light mb-4">Hygge's AI Assistant</h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  Get personalized mindfulness guidance, meditation tips, and wellness advice.
                </p>
              </div>
            )}

            {/* Chat Interface */}
            <div className="flex-1 flex flex-col space-y-3 mb-6 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`rounded-lg p-3 max-w-[75%] ${
                    msg.role === "user"
                      ? "self-end bg-calm-purple text-white"
                      : "self-start bg-white/20 text-white"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className="self-start rounded-lg p-3 bg-white/20 text-white max-w-[75%]">
                  Lumina is thinking...
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="calm-card p-4 border-black">
              <div className="flex items-end space-x-3">
                <Textarea
                  placeholder="Ask me anything about mindfulness, meditation, or wellness..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[60px] resize-none border-black bg-transparent focus:ring-0 text-black placeholder:text-black/60 focus:border-black"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className="bg-calm-purple hover:bg-calm-purple/90 text-white px-4 py-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Suggestions (only show when no current session) */}
            {(!currentSessionId || messages.length <= 1) && (
              <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <h3 className="text-white text-lg font-medium mb-4">Quick Questions</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "How can I reduce stress at work?",
                    "What's a good bedtime meditation?",
                    "Help me build a morning routine",
                    "I'm feeling anxious, what should I do?"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(suggestion)}
                      className="calm-card p-3 text-left hover:bg-white/5 transition-colors"
                      disabled={isLoading}
                    >
                      <span className="text-black">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                <Home className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-white/60 text-xs">Home</span>
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
            <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-calm-purple" />
              </div>
              <span className="text-white text-xs font-medium">Lumina</span>
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
    </div>
  );
};

export default AskAI;
