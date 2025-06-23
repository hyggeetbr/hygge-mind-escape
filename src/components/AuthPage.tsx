
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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
      // Always force account selection
      const { error } = await signInWithGoogle({ promptSelectAccount: true });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
      // DO NOT call toast for success! Handled after Supabase redirect
      // DO NOT call onAuthSuccess() here. Dashboard redirection is handled by session logic elsewhere.
      // Remain on loader/this page until redirect happens.
    } catch (error) {
      console.error("Google auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Show a dedicated loader screen while Google flow is in progress.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
        <span className="font-display text-5xl text-white animate-fade-in transition-all duration-500">Hygge</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center px-6 py-8 animate-slide-in-right">
      {/* Background decorative elements */}
      <div className="absolute top-16 right-12 w-20 h-20 bg-white/10 rounded-full blur-lg animate-float"></div>
      <div className="absolute bottom-20 left-8 w-28 h-28 bg-white/8 rounded-full blur-xl animate-pulse-soft"></div>
      
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="absolute top-8 left-8 text-white/80 hover:text-white hover:bg-white/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Hygge
      </Button>
      
      <Card className="w-full max-w-md calm-card shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-display text-gray-800">
            Welcome to Hygge
          </CardTitle>
          <CardDescription className="text-gray-600">
            Continue your mindful journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Google Authentication */}
          <Button
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full py-6 border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-colors"
            disabled={loading}
          >
            <div className="flex items-center justify-center space-x-3">
              <GoogleGIcon className="w-5 h-5" />
              <span className="font-medium text-gray-700">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </div>
          </Button>
          
          <p className="text-xs text-gray-500 text-center pt-4 leading-relaxed">
            By continuing, you agree to our mindful use of technology and data privacy practices
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
