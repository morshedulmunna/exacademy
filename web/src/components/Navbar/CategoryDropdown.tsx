"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/themes/ThemeProvider";
import { ChevronDown, BookOpen, Code, Palette, Database, Globe } from "lucide-react";
import Link from "next/link";

/**
 * Category options with icons and descriptions
 */
const CATEGORIES = [
  { id: "web-development", label: "Web Development", icon: Code, href: "/course?category=web-development", description: "HTML, CSS, JavaScript, React" },
  { id: "programming", label: "Programming", icon: Code, href: "/course?category=programming", description: "Python, Java, C++, Go" },
  { id: "design", label: "Design", icon: Palette, href: "/course?category=design", description: "UI/UX, Figma, Adobe Creative Suite" },
  { id: "data-science", label: "Data Science", icon: Database, href: "/course?category=data-science", description: "Machine Learning, AI, Analytics" },
  { id: "business", label: "Business", icon: BookOpen, href: "/course?category=business", description: "Marketing, Finance, Management" },
  { id: "languages", label: "Languages", icon: Globe, href: "/course?category=languages", description: "English, Spanish, French" },
] as const;

/**
 * Category dropdown component with hover effects and smooth animations
 */
export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-opacity-80 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
      >
        <span className="text-sm font-medium">Categories</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-80 rounded-lg shadow-lg border transition-all duration-200 ${theme === "dark" ? "bg-black border-gray-800" : "bg-white border-gray-200"}`}>
          <div className="p-2">
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-opacity-80 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"}`}
                >
                  <IconComponent className="w-5 h-5 text-purple-500" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{category.label}</div>
                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{category.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
