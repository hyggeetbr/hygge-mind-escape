
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomeButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-6 left-6 z-20 bg-white/80 text-hygge-moss shadow hover:bg-hygge-mist/90"
      onClick={() => navigate("/dashboard")}
      aria-label="Go to Dashboard"
    >
      <Home size={22} />
    </Button>
  );
};

export default HomeButton;
