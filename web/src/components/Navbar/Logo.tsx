"use client";

import Link from "next/link";
import React from "react";
import { useTheme } from "@/themes/ThemeProvider";

/**
 * Colorful fluid organic "M" logo with vibrant gradients
 */
export default function Logo() {
  const { theme } = useTheme();

  return (
    <Link href="/" className="flex items-center group">
      {/* Colorful Fluid Organic M Icon */}
      <div className="relative w-10 h-10 lg:w-20 lg:h-20 group-hover:scale-110 transition-transform duration-300">
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main fluid M shape with blue gradient */}
          <path d="M8 28 Q12 20 16 24 Q20 28 24 20 Q28 12 32 24 Q36 28 40 20" stroke="url(#blueGradient)" strokeWidth="3" strokeLinecap="round" fill="none" className="group-hover:opacity-80 transition-opacity duration-300" />

          {/* Secondary fluid stroke with purple gradient */}
          <path d="M10 26 Q14 18 18 22 Q22 26 26 18 Q30 10 34 22 Q38 26 40 18" stroke="url(#purpleGradient)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" className="group-hover:opacity-60 transition-opacity duration-300" />

          {/* Accent stroke with pink gradient */}
          <path d="M12 24 Q16 16 20 20 Q24 24 28 16 Q32 8 36 20 Q40 24 40 16" stroke="url(#pinkGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" className="group-hover:opacity-40 transition-opacity duration-300" />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
            <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#DB2777" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Link>
  );
}
