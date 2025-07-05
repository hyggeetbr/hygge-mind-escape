
import { BookOpen } from "lucide-react";
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";

const AncientTeachings = () => {
  return (
    <WisdomSubcategoryPage
      title="Ancient Teachings"
      description="Timeless wisdom from ancient philosophers and spiritual masters"
      subcategory="ancient_teachings"
      icon={<BookOpen className="w-16 h-16" />}
      color="from-amber-500 to-orange-500"
    />
  );
};

export default AncientTeachings;
