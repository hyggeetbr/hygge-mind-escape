
import { Coffee } from "lucide-react";
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";

const EverydayPhilosophy = () => {
  return (
    <WisdomSubcategoryPage
      title="Everyday Philosophy"
      description="Practical wisdom for daily life decisions and challenges"
      subcategory="everyday_philosophy"
      icon={<Coffee className="w-16 h-16" />}
      color="from-purple-500 to-indigo-500"
    />
  );
};

export default EverydayPhilosophy;
