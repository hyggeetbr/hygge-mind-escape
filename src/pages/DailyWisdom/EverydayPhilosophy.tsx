
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";
import { Lightbulb } from "lucide-react";

const EverydayPhilosophy = () => {
  return (
    <WisdomSubcategoryPage
      title="Everyday Philosophy"
      description="Practical philosophy for daily life and decision making"
      subcategory="everyday_philosophy"
      icon={<Lightbulb className="w-16 h-16" />}
      color="from-indigo-500 to-purple-600"
    />
  );
};

export default EverydayPhilosophy;
