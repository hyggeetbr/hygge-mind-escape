
import WisdomSubcategoryPage from "@/components/WisdomSubcategoryPage";
import { BookOpen } from "lucide-react";

const AncientTeachings = () => {
  return (
    <WisdomSubcategoryPage
      title="Ancient Teachings"
      description="Timeless wisdom from ancient philosophers and spiritual traditions"
      subcategory="ancient_teachings"
      icon={<BookOpen className="w-16 h-16" />}
      color="from-amber-500 to-orange-600"
    />
  );
};

export default AncientTeachings;
