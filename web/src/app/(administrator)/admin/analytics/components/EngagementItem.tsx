import React from "react";

interface EngagementItemProps {
  label: string;
  value: number;
  color: string;
}

/**
 * Individual engagement item component displaying user engagement metrics
 */
export const EngagementItem: React.FC<EngagementItemProps> = ({ label, value, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    </div>
    <span className="font-semibold text-gray-900 dark:text-white">{value.toLocaleString()}</span>
  </div>
);
