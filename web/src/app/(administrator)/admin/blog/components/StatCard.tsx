import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

/**
 * Individual statistic card component for blog metrics
 */
export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bgColor, iconColor }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center">
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

