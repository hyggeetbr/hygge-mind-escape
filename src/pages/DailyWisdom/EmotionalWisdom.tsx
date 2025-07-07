
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";
import { Heart } from "lucide-react";

const EmotionalWisdom = () => {
  return (
    <WisdomSubcategoryPage
      title="Emotional Wisdom"
      description="Understanding and navigating emotions with wisdom"
      subcategory="emotional_wisdom"
      icon={<Heart className="w-16 h-16" />}
      color="from-rose-500 to-pink-600"
    />
  );
};

export default EmotionalWisdom;
