import React from "react";

/**
 * Engagement summary component with progress bar and total active users
 */
export const EngagementSummary: React.FC = () => (
  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">Total Active Users</span>
      <span className="text-lg font-bold text-gray-900 dark:text-white">1,247</span>
    </div>
    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "68%" }}></div>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">68% engagement rate</p>
  </div>
);
