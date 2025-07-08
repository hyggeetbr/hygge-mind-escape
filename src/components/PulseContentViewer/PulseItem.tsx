
import { PulseContent } from "@/hooks/usePulseContent";

interface PulseItemProps {
  item: PulseContent;
  index: number;
  totalItems: number;
}

const PulseItem = ({ item, index, totalItems }: PulseItemProps) => {
  return (
    <div className="h-screen flex flex-col snap-start">
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
            {index + 1} / {totalItems}
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
  );
};

export default PulseItem;
