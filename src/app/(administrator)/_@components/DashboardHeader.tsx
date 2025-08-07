import React from "react";
import { Shield, TrendingUp } from "lucide-react";

/**
 * Dashboard Header Component
 * Displays the main dashboard header with title and welcome message
 */
export default function DashboardHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, Administrator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your platform today.
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">System Status: Online</span>
        </div>
      </div>
    </div>
  );
} 