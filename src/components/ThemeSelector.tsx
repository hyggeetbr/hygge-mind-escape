
import { useState } from "react";

interface Theme {
  id: string;
  name: string;
  gradient: string;
}

const themes: Theme[] = [
  {
    id: "default",
    name: "Purple",
    gradient: "linear-gradient(180deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)"
  },
  {
    id: "ocean",
    name: "Ocean",
    gradient: "linear-gradient(180deg, #0c4a6e 0%, #0284c7 50%, #0ea5e9 100%)"
  },
  {
    id: "forest",
    name: "Forest",
    gradient: "linear-gradient(180deg, #14532d 0%, #16a34a 50%, #22c55e 100%)"
  },
  {
    id: "sunset",
    name: "Sunset",
    gradient: "linear-gradient(180deg, #9a3412 0%, #ea580c 50%, #f97316 100%)"
  },
  {
    id: "rose",
    name: "Rose",
    gradient: "linear-gradient(180deg, #881337 0%, #e11d48 50%, #f43f5e 100%)"
  },
  {
    id: "mint",
    name: "Mint",
    gradient: "linear-gradient(180deg, #065f46 0%, #059669 50%, #10b981 100%)"
  },
  {
    id: "amber",
    name: "Amber",
    gradient: "linear-gradient(180deg, #92400e 0%, #d97706 50%, #f59e0b 100%)"
  },
  {
    id: "indigo",
    name: "Indigo",
    gradient: "linear-gradient(180deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)"
  }
];

interface ThemeSelectorProps {
  onThemeChange: (gradient: string) => void;
}

const ThemeSelector = ({ onThemeChange }: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme.id);
    onThemeChange(theme.gradient);
  };

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
            style={{ background: theme.gradient }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
