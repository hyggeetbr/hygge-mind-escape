
import { useState, useEffect } from "react";
import { PulseContent } from "@/hooks/usePulseContent";

interface PulseContentViewerProps {
  content: PulseContent[];
}

const PulseContentViewer = ({ content }: PulseContentViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isDownSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && currentIndex < content.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, content.length]);

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-xl">No content available</div>
        </div>
      </div>
    );
  }

  const currentContent = content[currentIndex];

  return (
    <div
      className="h-screen bg-black text-white overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={handleScroll}
    >
      <div className="h-full flex flex-col">
        {/* Image Section - Empty for now as requested */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center">
          {currentContent.image_url ? (
            <img
              src={currentContent.image_url}
              alt={currentContent.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-500 text-lg">Image placeholder</div>
          )}
        </div>

        {/* Content Section */}
        <div className="bg-black p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white leading-tight">
            {currentContent.title}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {currentContent.content}
          </p>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full px-3 py-1">
          <span className="text-white text-sm">
            {currentIndex + 1} / {content.length}
          </span>
        </div>

        {/* Swipe Hint */}
        {currentIndex === 0 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm animate-pulse">
            Swipe up for next
          </div>
        )}
      </div>
    </div>
  );
};

export default PulseContentViewer;
