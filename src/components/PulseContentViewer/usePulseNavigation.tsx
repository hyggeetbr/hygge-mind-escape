
import { useState, useRef, useEffect } from "react";

export const usePulseNavigation = (contentLength: number) => {
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

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < contentLength - 1) {
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
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < contentLength) {
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
  }, [currentIndex, contentLength, isScrolling]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  return {
    currentIndex,
    setCurrentIndex,
    containerRef,
    scrollToIndex,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    handleScroll,
    handleManualScroll
  };
};
