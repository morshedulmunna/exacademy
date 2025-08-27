import React from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  bgColor: string;
  textColor: string;
}

/**
 * Individual metric card component displaying key performance indicators
 */
export const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, change, bgColor, textColor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="text-center">
      <div className={`w-16 h-16 mx-auto ${bgColor} rounded-full flex items-center justify-center mb-4`}>{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{change}</p>
    </div>
  </div>
);
