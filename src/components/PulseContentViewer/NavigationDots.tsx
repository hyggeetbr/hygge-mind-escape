
import { PulseContent } from "@/hooks/usePulseContent";

interface NavigationDotsProps {
  content: PulseContent[];
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const NavigationDots = ({ content, currentIndex, onDotClick }: NavigationDotsProps) => {
  return (
    <div className="fixed bottom-20 right-4 flex flex-col space-y-2 z-10">
      {content.map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === currentIndex ? "bg-white" : "bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

export default NavigationDots;
