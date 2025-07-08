
import { PulseContent } from "@/hooks/usePulseContent";
import PulseItem from "./PulseContentViewer/PulseItem";
import NavigationDots from "./PulseContentViewer/NavigationDots";
import SwipeHint from "./PulseContentViewer/SwipeHint";
import { usePulseNavigation } from "./PulseContentViewer/usePulseNavigation";

interface PulseContentViewerProps {
  content: PulseContent[];
}

const PulseContentViewer = ({ content }: PulseContentViewerProps) => {
  const {
    currentIndex,
    setCurrentIndex,
    containerRef,
    scrollToIndex,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    handleScroll,
    handleManualScroll
  } = usePulseNavigation(content.length);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    scrollToIndex(index);
  };

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
        <PulseItem
          key={item.id}
          item={item}
          index={index}
          totalItems={content.length}
        />
      ))}

      <NavigationDots
        content={content}
        currentIndex={currentIndex}
        onDotClick={handleDotClick}
      />

      <SwipeHint show={currentIndex === 0} />
    </div>
  );
};

export default PulseContentViewer;
