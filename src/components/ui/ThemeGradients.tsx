"use client";

import { useTheme } from "@/themes/ThemeProvider";

/**
 * Theme-aware gradient utility component
 * Provides consistent gradient styling across light and dark modes
 */
export const useThemeGradients = () => {
  const { theme } = useTheme();

  return {
    // Background gradients
    bgGradient: theme === 'light' 
      ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
      : 'bg-gradient-to-r from-purple-500 to-pink-500',
    
    // Text gradients
    textGradient: theme === 'light'
      ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
      : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600',
    
    // Border gradients
    borderGradient: theme === 'light'
      ? 'border-gradient-to-r from-blue-500 to-indigo-500'
      : 'border-gradient-to-r from-purple-500 to-pink-500',
    
    // Hover states
    hoverBgGradient: theme === 'light'
      ? 'hover:from-blue-600 hover:to-indigo-600'
      : 'hover:from-purple-600 hover:to-pink-600',
    
    // Active states
    activeBgGradient: theme === 'light'
      ? 'bg-gradient-to-r from-blue-50 to-indigo-50'
      : 'bg-gradient-to-r from-purple-900/20 to-pink-900/20',
    
    // Icon colors
    iconColor: theme === 'light' ? 'text-blue-600' : 'text-purple-400',
    iconHoverColor: theme === 'light' ? 'group-hover:text-blue-500' : 'group-hover:text-purple-400',
    
    // Text colors
    primaryText: theme === 'light' ? 'text-blue-700' : 'text-purple-300',
    secondaryText: theme === 'light' ? 'text-blue-600' : 'text-purple-400',
    
    // Border colors
    borderColor: theme === 'light' ? 'border-blue-500' : 'border-purple-500',
    
    // Badge colors
    badgeBg: theme === 'light' ? 'bg-blue-100' : 'bg-purple-900',
    badgeText: theme === 'light' ? 'text-blue-800' : 'text-purple-200',
    
    // Focus ring colors
    focusRing: theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-purple-500',
  };
};

/**
 * Theme-aware gradient components
 */
export const ThemeGradientBg = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { bgGradient } = useThemeGradients();
  return <div className={`${bgGradient} ${className}`}>{children}</div>;
};

export const ThemeGradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { textGradient } = useThemeGradients();
  return <span className={`${textGradient} ${className}`}>{children}</span>;
};
