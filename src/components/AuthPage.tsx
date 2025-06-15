
import { useState } from "react";
import { ArrowLeft, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface AuthPageProps {
  onBack: () => void;
  onAuthSuccess: () => void;
}

const AuthPage = ({ onBack, onAuthSuccess }: AuthPageProps) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp, signIn, signInWithGoogle } = useAuth();

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

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign In Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Signed in successfully!",
          });
          onAuthSuccess();
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Sign Up Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Account created! Please check your email for verification.",
          });
        }
      }
    } catch (error) {
      console.error("Email auth error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = () => {
    toast({
      title: "Coming Soon",
      description: "Phone authentication will be available soon!",
    });
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
            {isLogin ? "Welcome Back" : "Join Hygge"}
          </CardTitle>
          <CardDescription className="text-hygge-earth/70">
            {isLogin 
              ? "Continue your mindful journey" 
              : "Start your path to digital wellness"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!authMethod ? (
            <>
              {/* Google Authentication */}
              <Button
                onClick={handleGoogleAuth}
                variant="outline"
                className="w-full py-6 border-hygge-stone/40"
                disabled={loading}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-sm"></div>
                  <span className="font-medium text-hygge-moss">
                    {loading ? "Signing in..." : "Continue with Google"}
                  </span>
                </div>
              </Button>
              
              {/* Phone Authentication */}
              <Button
                onClick={() => setAuthMethod('phone')}
                variant="outline"
                className="w-full py-6 border-hygge-stone/40"
                disabled={loading}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Phone className="w-5 h-5 text-hygge-moss" />
                  <span className="font-medium text-hygge-moss">Continue with Phone</span>
                </div>
              </Button>
              
              {/* Email Authentication */}
              <Button
                onClick={() => setAuthMethod('email')}
                variant="outline"
                className="w-full py-6 border-hygge-stone/40"
                disabled={loading}
              >
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5 text-hygge-moss" />
                  <span className="font-medium text-hygge-moss">Continue with Email</span>
                </div>
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-sm text-hygge-earth/60">
                  {isLogin ? "New to Hygge? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-hygge-moss hover:text-hygge-earth font-medium underline"
                    disabled={loading}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Phone number form */}
              {authMethod === 'phone' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="text-hygge-moss font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="mt-2 border-hygge-stone/40 focus:border-hygge-sage focus:ring-hygge-sage/20"
                    />
                  </div>
                  <Button
                    onClick={handlePhoneAuth}
                    className="w-full bg-hygge-moss hover:bg-hygge-earth text-hygge-cream"
                    disabled={loading}
                  >
                    Send Verification Code
                  </Button>
                </div>
              )}
              
              {/* Email form */}
              {authMethod === 'email' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-hygge-moss font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 border-hygge-stone/40 focus:border-hygge-sage focus:ring-hygge-sage/20"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-hygge-moss font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 border-hygge-stone/40 focus:border-hygge-sage focus:ring-hygge-sage/20"
                      disabled={loading}
                    />
                  </div>
                  <Button
                    onClick={handleEmailAuth}
                    className="w-full bg-hygge-moss hover:bg-hygge-earth text-hygge-cream"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                  </Button>
                </div>
              )}
              
              <Button
                onClick={() => setAuthMethod(null)}
                variant="ghost"
                className="w-full text-hygge-earth hover:text-hygge-moss hover:bg-hygge-sage/10"
                disabled={loading}
              >
                Back to options
              </Button>
            </>
          )}
          
          <p className="text-xs text-hygge-stone/80 text-center pt-4 leading-relaxed">
            By continuing, you agree to our mindful use of technology and data privacy practices
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
