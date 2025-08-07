import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "yellow" | "purple" | "red";
  change: string;
  changeType: "increase" | "decrease";
}

/**
 * Stats Card Component
 * Displays a single statistic with icon, value, and change indicator
 */
export default function StatsCard({ title, value, icon: Icon, color, change, changeType }: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800"
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800"
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      icon: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "bg-purple-500",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800"
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800"
    }
  };

  const currentColor = colorClasses[color];

  return (
    <div className={`p-6 rounded-xl border ${currentColor.bg} ${currentColor.border} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value.toLocaleString()}</p>
          <div className="flex items-center space-x-1">
            {changeType === "increase" ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              changeType === "increase" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">from last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 ${currentColor.icon} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
} 