
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Star, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Premium = () => {
  const navigate = useNavigate();

  const features = [
    "Unlimited access to all meditations",
    "Exclusive premium content library",
    "Advanced progress tracking",
    "Offline downloads",
    "Ad-free experience",
    "Priority customer support",
    "Early access to new features",
    "Personalized meditation plans"
  ];

  const plans = [
    {
      name: "Monthly",
      price: "$9.99",
      period: "/month",
      popular: false
    },
    {
      name: "Yearly",
      price: "$59.99",
      period: "/year",
      popular: true,
      savings: "Save 50%"
    }
  ];

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleSleep = () => {
    navigate("/sleep");
  };

  const handleDiscover = () => {
    navigate("/discover");
  };

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen calm-gradient relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="floating-element absolute top-40 right-20 w-48 h-48 bg-white/3 rounded-full blur-2xl" />
        <div className="floating-element absolute bottom-32 left-32 w-24 h-24 bg-white/4 rounded-full blur-lg" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-white text-xl font-medium">Premium</h1>
        <div className="w-10 h-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Hero Section */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-calm-orange rounded-full mx-auto mb-6 flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white text-3xl font-light mb-4">Unlock Everything</h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Take your mindfulness journey to the next level with unlimited access to our premium content.
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="calm-card p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Premium Features</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={feature} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-calm-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-white text-xl font-medium mb-4 text-center">Choose Your Plan</h3>
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <div 
                key={plan.name} 
                className={`calm-card p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'ring-2 ring-calm-orange' : ''
                }`}
              >
                {plan.popular && (
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-calm-orange text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h4>
                  <div className="flex items-baseline justify-center space-x-1 mb-2">
                    <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-calm-orange font-medium mb-4">{plan.savings}</div>
                  )}
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-calm-orange hover:bg-calm-orange/90' 
                        : 'bg-calm-purple hover:bg-calm-purple/90'
                    } text-white rounded-full py-3`}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="calm-card p-6">
            <div className="text-center">
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-calm-orange fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                "Hygge Premium has transformed my daily routine. The exclusive content and offline downloads make it perfect for my busy lifestyle."
              </p>
              <p className="text-gray-600 font-medium">- Sarah M.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="text-white/60 text-sm">
            7-day free trial • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 z-30">
        <div className="flex justify-around py-4 px-2">
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <span className="text-white/60 text-xs">Home</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/sleep")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">🌙</div>
            <span className="text-white/60 text-xs">Sleep</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/discover")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">🔍</div>
            <span className="text-white/60 text-xs">Discover</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/community")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 21-3-3"/>
                <path d="m16 18 3 3"/>
              </svg>
            </div>
            <span className="text-white/60 text-xs">Community</span>
          </div>
          <div 
            className="flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="w-6 h-6 text-white/60 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/60"
              >
                <path d="M12 8V4M4 8H20M6.9 15H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2M17 15h1.9a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2M15 8a3 3 0 1 0-6 0"/>
              </svg>
            </div>
            <span className="text-white/60 text-xs">Lumina</span>
          </div>
          <div className="flex flex-col items-center space-y-1 min-w-0 flex-1">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">⭐</div>
            <span className="text-white text-xs font-medium">Premium</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
