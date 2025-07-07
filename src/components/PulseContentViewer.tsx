
import { useState, useEffect, useRef } from "react";
import { PulseContent } from "@/hooks/usePulseContent";

interface PulseContentViewerProps {
  content: PulseContent[];
}

const PulseContentViewer = ({ content }: PulseContentViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 50;

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const targetScrollTop = index * window.innerHeight;
      
      setIsScrolling(true);
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Set scrolling to false after animation completes
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndY.current = null;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current || isScrolling) return;
    
    const distance = touchStartY.current - touchEndY.current;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      handleNext();
    } else if (isDownSwipe) {
      handlePrev();
    }
  };

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isScrolling) return;
    
    if (e.deltaY > 0) {
      handleNext();
    } else if (e.deltaY < 0) {
      handlePrev();
    }
  };

  const handleManualScroll = () => {
    if (containerRef.current && !isScrolling) {
      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const newIndex = Math.round(scrollTop / window.innerHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < content.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === "ArrowDown") {
        handleNext();
      } else if (e.key === "ArrowUp") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, content.length, isScrolling]);

  useEffect(() => {
    // Scroll to top on component mount
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  if (!content || content.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <div className="text-xl">No content available</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen bg-black text-white overflow-y-auto snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={handleScroll}
      onScroll={handleManualScroll}
    >
      {content.map((item, index) => (
        <div key={item.id} className="h-screen flex flex-col snap-start">
          {/* Image Section - Takes up 15% of screen height */}
          <div className="h-[15vh] bg-gray-900 flex items-center justify-center relative">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 text-lg">Image placeholder</div>
            )}
            
            {/* Progress Indicator - positioned on image */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full px-3 py-1">
              <span className="text-white text-sm">
                {index + 1} / {content.length}
              </span>
            </div>
          </div>

          {/* Content Section - Takes up 85% of screen height */}
          <div className="h-[85vh] bg-black p-6 space-y-4 overflow-y-auto">
            <h2 className="text-xl font-bold text-white leading-tight">
              {item.title}
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              {item.content}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Dots - Fixed position */}
      <div className="fixed bottom-20 right-4 flex flex-col space-y-2 z-10">
        {content.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              scrollToIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      {currentIndex === 0 && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm animate-pulse z-10">
          Swipe up for next
        </div>
      )}
    </div>
  );
};

export default PulseContentViewer;
