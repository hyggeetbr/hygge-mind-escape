
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Folklore = () => {
  const navigate = useNavigate();
  const { country } = useParams();
  
  const countryName = country ? country.charAt(0).toUpperCase() + country.slice(1) : "";

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/echo-culture")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Folklore - {countryName}</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-6 text-center">
          <h2 className="text-white text-2xl font-semibold mb-4">
            {countryName} Folklore
          </h2>
          <p className="text-white/70 text-base">
            Discover the rich cultural heritage and traditional stories of {countryName}. 
            This section will feature authentic folklore, myths, and legends passed down through generations.
          </p>
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-white/60 text-sm">
              Content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folklore;
