
import { Globe } from "lucide-react";
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";

const WisdomFromWorld = () => {
  return (
    <WisdomSubcategoryPage
      title="Wisdom from the World"
      description="Universal insights from diverse cultures and traditions"
      subcategory="wisdom_from_world"
      icon={<Globe className="w-16 h-16" />}
      color="from-green-500 to-emerald-500"
    />
  );
};

export default WisdomFromWorld;
