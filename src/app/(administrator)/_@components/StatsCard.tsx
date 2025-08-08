import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "yellow" | "purple" | "red" | "gray";
  change: string;
  changeType: "increase" | "decrease";
  description?: string;
}

/**
 * Modern Stats Card Component
 * Enhanced with gradients, improved spacing, and better visual hierarchy
 * Displays a single statistic with icon, value, and change indicator
 */
export default function StatsCard({ title, value, icon: Icon, color, change, changeType, description }: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      icon: "bg-gradient-to-br from-blue-500 to-indigo-500",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200/50 dark:border-blue-700/50",
      hover: "hover:shadow-blue-100 dark:hover:shadow-blue-900/20",
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      icon: "bg-gradient-to-br from-green-500 to-emerald-500",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200/50 dark:border-green-700/50",
      hover: "hover:shadow-green-100 dark:hover:shadow-green-900/20",
    },
    yellow: {
      bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      icon: "bg-gradient-to-br from-yellow-500 to-orange-500",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200/50 dark:border-yellow-700/50",
      hover: "hover:shadow-yellow-100 dark:hover:shadow-yellow-900/20",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      icon: "bg-gradient-to-br from-purple-500 to-violet-500",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200/50 dark:border-purple-700/50",
      hover: "hover:shadow-purple-100 dark:hover:shadow-purple-900/20",
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      icon: "bg-gradient-to-br from-red-500 to-pink-500",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200/50 dark:border-red-700/50",
      hover: "hover:shadow-red-100 dark:hover:shadow-red-900/20",
    },
    gray: {
      bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
      icon: "bg-gradient-to-br from-gray-500 to-gray-600",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-200/50 dark:border-gray-700/50",
      hover: "hover:shadow-gray-100 dark:hover:shadow-gray-900/20",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.gray;

  // Format value based on type
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${currentColor.bg} ${currentColor.border} ${currentColor.hover}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{formattedValue}</p>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{description}</p>}
            <div className="flex items-center space-x-2">
              {changeType === "increase" ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
              <span className={`text-sm font-medium ${changeType === "increase" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{change}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">from last month</span>
            </div>
          </div>
          <div className={`w-14 h-14 ${currentColor.icon} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
