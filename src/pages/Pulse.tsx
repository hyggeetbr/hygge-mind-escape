
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Users, Bot, Music, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePulseContent } from "@/hooks/usePulseContent";
import PulseContentViewer from "@/components/PulseContentViewer";

const Pulse = () => {
  const navigate = useNavigate();
  const { data: pulseContent, isLoading, error } = usePulseContent();

  if (isLoading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading pulse content...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400">Error loading content</div>
          <Button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-white text-black hover:bg-gray-200"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white hover:bg-white hover:bg-opacity-20"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Pulse</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Content Viewer */}
      <div className="pt-16">
        <PulseContentViewer content={pulseContent || []} />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-t border-gray-800 z-50">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer opacity-60"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-gray-400 text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer opacity-60"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <span className="text-gray-400 text-xs">Echo</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-white text-xs font-medium">Pulse</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer opacity-60"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-gray-400 text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer opacity-60"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-gray-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-gray-400 text-xs">Lumina</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pulse;
