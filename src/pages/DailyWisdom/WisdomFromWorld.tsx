
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";
import { Globe } from "lucide-react";

const WisdomFromWorld = () => {
  return (
    <WisdomSubcategoryPage
      title="Wisdom From World"
      description="Global perspectives on wisdom and life philosophy"
      subcategory="wisdom_from_world"
      icon={<Globe className="w-16 h-16" />}
      color="from-green-500 to-teal-600"
    />
  );
};

export default WisdomFromWorld;
