
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
    id: "warm-minimal",
    name: "Warm Minimal",
    background: "url('/lovable-uploads/abeeee38-ea73-4312-a2e4-d9cc4545a4b9.png')"
  },
  {
    id: "soft-abstract",
    name: "Soft Abstract",
    background: "url('/lovable-uploads/c36c1711-a9ae-45e9-bb0e-5dc61cbbcb61.png')"
  },
  {
    id: "pastel-shapes",
    name: "Pastel Shapes",
    background: "url('/lovable-uploads/20fa8e2d-bc99-49fb-a9ce-06d18eb1cd41.png')"
  },
  {
    id: "flowing-curves",
    name: "Flowing Curves",
    background: "url('/lovable-uploads/5eb68525-5e1b-42d7-a3c8-451f912184db.png')"
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
          setLoading(false);
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
    // Immediately update the UI state to prevent flickering
    setSelectedTheme(theme.id);
    onThemeChange(theme.background);

    if (!user) return;

    // Save to database in the background without affecting UI
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
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex space-x-2 bg-white/80 backdrop-blur-md rounded-full p-2 border border-botanical-purple/30">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
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
