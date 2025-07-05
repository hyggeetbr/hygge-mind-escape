
import { Crown } from "lucide-react";
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";

const WomensWisdom = () => {
  return (
    <WisdomSubcategoryPage
      title="Women's Wisdom"
      description="Insights and teachings from inspiring women throughout history"
      subcategory="womens_wisdom"
      icon={<Crown className="w-16 h-16" />}
      color="from-violet-500 to-purple-600"
    />
  );
};

export default WomensWisdom;
