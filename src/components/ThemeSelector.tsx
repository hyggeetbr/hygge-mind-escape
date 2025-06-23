
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
    id: "pattern1",
    name: "Geometric",
    background: "radial-gradient(circle at 20% 50%, #120a8f 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%), radial-gradient(circle at 40% 80%, #7c3aed 0%, transparent 50%), linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
  },
  {
    id: "pattern2", 
    name: "Waves",
    background: "linear-gradient(45deg, #0f172a 25%, transparent 25%), linear-gradient(-45deg, #0f172a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%), linear-gradient(135deg, #334155 0%, #0ea5e9 100%)"
  },
  {
    id: "pattern3",
    name: "Dots",
    background: "radial-gradient(circle, #ffffff 2px, transparent 2px), radial-gradient(circle, #a855f7 1px, transparent 1px), linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)"
  },
  {
    id: "pattern4",
    name: "Forest",
    background: "conic-gradient(from 90deg at 50% 0%, transparent, #16a34a 50%, transparent), linear-gradient(180deg, #14532d 0%, #16a34a 50%, #22c55e 100%)"
  },
  {
    id: "pattern5",
    name: "Sunset",
    background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px), linear-gradient(180deg, #9a3412 0%, #ea580c 50%, #f97316 100%)"
  },
  {
    id: "pattern6",
    name: "Rose",
    background: "radial-gradient(ellipse at top, #f43f5e 0%, transparent 70%), radial-gradient(ellipse at bottom, #881337 0%, transparent 70%), linear-gradient(180deg, #881337 0%, #e11d48 50%, #f43f5e 100%)"
  },
  {
    id: "pattern7",
    name: "Mint",
    background: "linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 50%), linear-gradient(180deg, #065f46 0%, #059669 50%, #10b981 100%)"
  },
  {
    id: "pattern8",
    name: "Amber",
    background: "conic-gradient(from 180deg at 50% 50%, #92400e, #d97706, #f59e0b, #92400e), linear-gradient(180deg, rgba(146,64,14,0.8) 0%, rgba(217,119,6,0.6) 50%, rgba(245,158,11,0.4) 100%)"
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

      // Removed the success toast notification
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex space-x-3 bg-white/10 backdrop-blur-md rounded-full p-3 border border-white/20">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              selectedTheme === theme.id 
                ? 'border-white scale-110' 
                : 'border-white/30 hover:border-white/60'
            }`}
            style={{ background: theme.background }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
