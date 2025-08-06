"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "@/themes/ThemeProvider";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Mobile menu toggle button with hamburger/close icon
 */
export default function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  const { theme } = useTheme();

  return (
    <button 
      onClick={onClick} 
      className={`lg:hidden p-2 transition-colors duration-300 mobile-menu-button ${
        theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
} 