import React from "react";
import { TrendingUp } from "lucide-react";
import { StatsGrid } from "../_@components";

interface OverviewStatsProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
}

/**
 * Business overview statistics component
 */
export const OverviewStats: React.FC<OverviewStatsProps> = (stats) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Business Overview</h2>
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <TrendingUp className="w-4 h-4" />
        <span>+12.5% from last month</span>
      </div>
    </div>
    <StatsGrid {...stats} />
  </div>
);
