
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";
import { Brain } from "lucide-react";

const ModernMindfulness = () => {
  return (
    <WisdomSubcategoryPage
      title="Modern Mindfulness"
      description="Contemporary approaches to mindfulness and mental wellness"
      subcategory="modern_mindfulness"
      icon={<Brain className="w-16 h-16" />}
      color="from-blue-500 to-purple-600"
    />
  );
};

export default ModernMindfulness;
