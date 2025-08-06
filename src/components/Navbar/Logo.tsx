"use client";

import Link from "next/link";
import React from "react";
import { useTheme } from "@/themes/ThemeProvider";

/**
 * Modern minimalist logo with initials and clean typography
 */
export default function Logo() {
  const { theme } = useTheme();

  return (
    <Link href="/" className="flex items-center space-x-3 group">
      {/* Modern Icon with MM */}
      <div className="relative w-10 h-10 lg:w-12 lg:h-12 group-hover:scale-105 transition-transform duration-200">
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle */}
          <circle cx="20" cy="20" r="18" className={`${theme === "dark" ? "fill-gray-800" : "fill-gray-50"} group-hover:fill-blue-50 dark:group-hover:fill-blue-900/20 transition-colors duration-200`} />

          {/* MM letters */}
          <path d="M12 26L15 14L18 20L21 14L24 20L27 14L30 26" stroke="url(#mmGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="group-hover:stroke-blue-600 transition-colors duration-200" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="mmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Elements */}
      <div className="flex flex-col">
        <span className={`font-bold text-lg lg:text-xl group-hover:text-blue-700 transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>MM</span>
        <span className={`text-xs lg:text-sm group-hover:text-blue-600 transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Developer</span>
      </div>
    </Link>
  );
}
