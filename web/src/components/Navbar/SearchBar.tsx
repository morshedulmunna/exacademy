"use client";

import React, { useState } from "react";
import { useTheme } from "@/themes/ThemeProvider";
import { Search } from "lucide-react";

/**
 * Search bar component with theme-aware styling and search functionality
 */
export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
        <input
          type="text"
          placeholder="Search courses, blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 ${
            theme === "dark" ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800" : "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white"
          }`}
        />
      </div>
    </form>
  );
}
