"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const getButtonClasses = () => {
    const baseClasses = "p-2 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none ";
    return theme === "dark" ? `${baseClasses} text-gray-300 hover:text-white hover:bg-white/10` : `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-gray-100`;
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} className={getButtonClasses()}>
      {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
    </button>
  );
};

export default ThemeToggler;
