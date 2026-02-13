import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, language, setLanguage, isRTL } = useTheme();

  return (
    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Language Toggle */}
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-gray-300" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
          className="bg-transparent text-gray-300 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-cyan-500"
        >
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
