
import { Heart } from "lucide-react";
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";

const EmotionalWisdom = () => {
  return (
    <WisdomSubcategoryPage
      title="Emotional Wisdom"
      description="Understanding and navigating the depths of human emotion"
      subcategory="emotional_wisdom"
      icon={<Heart className="w-16 h-16" />}
      color="from-pink-500 to-rose-500"
    />
  );
};

export default EmotionalWisdom;
