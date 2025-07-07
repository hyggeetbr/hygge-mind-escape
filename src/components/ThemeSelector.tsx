
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Theme {
  id: string;
  name: string;
  background: string;
}

const themes: Theme[] = [
  {
    id: "botanical",
    name: "Botanical",
    background: "url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')"
  },
  {
    id: "pattern1",
    name: "Geometric",
    background: "radial-gradient(circle at 20% 50%, #8b7693 0%, transparent 50%), radial-gradient(circle at 80% 20%, #93c5fd 0%, transparent 50%), radial-gradient(circle at 40% 80%, #c4b5fd 0%, transparent 50%), linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)"
  },
  {
    id: "pattern2", 
    name: "Waves",
    background: "linear-gradient(45deg, #f9fafb 25%, transparent 25%), linear-gradient(-45deg, #f9fafb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%), linear-gradient(135deg, #d1d5db 0%, #93c5fd 100%)"
  },
  {
    id: "pattern3",
    name: "Dots",
    background: "radial-gradient(circle, #8b7693 2px, transparent 2px), radial-gradient(circle, #c4b5fd 1px, transparent 1px), linear-gradient(135deg, #e5e7eb 0%, #c4b5fd 50%, #93c5fd 100%)"
  },
  {
    id: "pattern4",
    name: "Forest",
    background: "conic-gradient(from 90deg at 50% 0%, transparent, #10b981 50%, transparent), linear-gradient(180deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)"
  },
  {
    id: "pattern5",
    name: "Sunset",
    background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,118,147,0.1) 10px, rgba(139,118,147,0.1) 20px), linear-gradient(180deg, #fed7aa 0%, #fdba74 50%, #fb923c 100%)"
  },
  {
    id: "pattern6",
    name: "Rose",
    background: "radial-gradient(ellipse at top, #fda4af 0%, transparent 70%), radial-gradient(ellipse at bottom, #be185d 0%, transparent 70%), linear-gradient(180deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)"
  },
  {
    id: "pattern7",
    name: "Mint",
    background: "linear-gradient(90deg, transparent 50%, rgba(139,118,147,0.1) 50%), linear-gradient(180deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)"
  },
  {
    id: "pattern8",
    name: "Amber",
    background: "conic-gradient(from 180deg at 50% 50%, #d97706, #f59e0b, #fbbf24, #d97706), linear-gradient(180deg, rgba(217,119,6,0.3) 0%, rgba(245,158,11,0.2) 50%, rgba(251,191,36,0.1) 100%)"
  }
];

interface ThemeSelectorProps {
  onThemeChange: (background: string) => void;
}

const ThemeSelector = ({ onThemeChange }: ThemeSelectorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserTheme = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('theme_preference')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user theme:', error);
          return;
        }

        if (data?.theme_preference) {
          const theme = themes.find(t => t.id === data.theme_preference);
          if (theme) {
            setSelectedTheme(theme.id);
            onThemeChange(theme.background);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserTheme();
  }, [user, onThemeChange]);

  const handleThemeSelect = async (theme: Theme) => {
    setSelectedTheme(theme.id);
    onThemeChange(theme.background);

    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ theme_preference: theme.id })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving theme preference:', error);
        toast({
          title: "Error",
          description: "Failed to save theme preference",
          variant: "destructive",
        });
        return;
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex space-x-3 bg-white/80 backdrop-blur-md rounded-full p-3 border border-botanical-purple/30">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              selectedTheme === theme.id 
                ? 'border-botanical-purple scale-110' 
                : 'border-botanical-sage/50 hover:border-botanical-purple/70'
            }`}
            style={{ 
              background: theme.id === 'botanical' 
                ? `url('/lovable-uploads/8ec4329a-116c-403a-85d5-6d85d61efc18.png')` 
                : theme.background,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
