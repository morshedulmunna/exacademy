"use client";

import Link from "next/link";
import React from "react";
import { useTheme } from "@/themes/ThemeProvider";
import { NAV_ITEMS } from "./constants";

/**
 * Desktop navigation component with hover effects and underline animations
 */
export default function Navigation() {
  const { theme } = useTheme();

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {NAV_ITEMS.map(({ href, label, icon, target }) => (
        <Link 
          key={href} 
          href={href} 
          target={target} 
          className={`transition-colors duration-300 relative group text-sm font-medium ${
            theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
        </Link>
      ))}
    </nav>
  );
} 