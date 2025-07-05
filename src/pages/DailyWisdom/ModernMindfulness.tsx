
import { Lightbulb } from "lucide-react";
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";

const ModernMindfulness = () => {
  return (
    <WisdomSubcategoryPage
      title="Modern Mindfulness"
      description="Contemporary approaches to mindful living and awareness"
      subcategory="modern_mindfulness"
      icon={<Lightbulb className="w-16 h-16" />}
      color="from-blue-500 to-teal-500"
    />
  );
};

export default ModernMindfulness;
