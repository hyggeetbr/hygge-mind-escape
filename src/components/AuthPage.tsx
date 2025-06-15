import { useState } from "react";
import { ArrowLeft, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import GoogleGIcon from "./GoogleGIcon";

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

const AuthPage = ({ onBack, onAuthSuccess }: AuthPageProps) => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in with Google successfully!",
        });
        onAuthSuccess();
      }
    } catch (error) {
      console.error("Google auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 animate-slide-in-right">
      {/* Background decorative elements */}
      <div className="absolute top-16 right-12 w-20 h-20 bg-hygge-sage/20 rounded-full blur-lg animate-float"></div>
      <div className="absolute bottom-20 left-8 w-28 h-28 bg-hygge-stone/25 rounded-full blur-xl animate-pulse-soft"></div>
      
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="absolute top-8 left-8 text-hygge-moss hover:text-hygge-earth hover:bg-hygge-sage/20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Hygge
      </Button>
      
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-hygge-stone/30 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-display text-hygge-moss">
            Welcome to Hygge
          </CardTitle>
          <CardDescription className="text-hygge-earth/70">
            Continue your mindful journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Google Authentication */}
          <Button
            onClick={handleGoogleAuth}
            variant="plain"
            className="w-full py-6 border-hygge-stone/40"
            disabled={loading}
          >
            <div className="flex items-center justify-center space-x-3">
              <GoogleGIcon className="w-5 h-5" />
              <span className="font-medium text-hygge-moss">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </div>
          </Button>
          
          <p className="text-xs text-hygge-stone/80 text-center pt-4 leading-relaxed">
            By continuing, you agree to our mindful use of technology and data privacy practices
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
