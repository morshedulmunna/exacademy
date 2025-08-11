"use client";

import React from "react";
import { useThemeGradients } from "@/components/ui/ThemeGradients";
import { Shield, TrendingUp } from "lucide-react";
import QuickActionsDropdown from "./QuickActionsDropdown";

/**
 * Dashboard Header Component
 * Displays the main dashboard header with title, welcome message, and quick actions
 */
export default function DashboardHeader() {
  const gradients = useThemeGradients();
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, Administrator</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-lg shadow hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-white">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              <TrendingUp className="w-5 h-5 relative z-10 animate-pulse" />
            </div>
            <span className="text-sm font-medium">System Status: Online</span>
            <div className="w-2 h-2 bg-blue-500 dark:bg-cyan-300 rounded-full animate-bounce"></div>
          </div>
          <QuickActionsDropdown />
        </div>
      </div>
    </div>
  );
}
