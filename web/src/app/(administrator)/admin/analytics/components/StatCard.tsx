import React from "react";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  growth: number;
  icon: React.ReactNode;
  bgColor: string;
}

/**
 * Individual statistic card component with growth indicator
 */
export const StatCard: React.FC<StatCardProps> = ({ title, value, growth, icon, bgColor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <div className="flex items-center mt-1">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 dark:text-green-400">+{growth}%</span>
        </div>
      </div>
      <div className={`p-3 ${bgColor} rounded-lg`}>
        {icon}
      </div>
    </div>
  </div>
);
