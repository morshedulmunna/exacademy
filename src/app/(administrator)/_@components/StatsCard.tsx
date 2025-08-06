import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

/**
 * Stats Card Component
 * Displays a single statistic with icon and value
 */
export default function StatsCard({ title, value, icon, bgColor }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/20 p-6 transition-colors duration-200">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${bgColor} rounded-md flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
} 