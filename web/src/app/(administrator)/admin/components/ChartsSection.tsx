import React from "react";
import { SimpleChart } from "../_@components";

interface ChartData {
  label: string;
  value: number;
}

interface ChartsSectionProps {
  viewsData: ChartData[];
  userGrowthData: ChartData[];
}

/**
 * Charts section component for admin dashboard
 */
export const ChartsSection: React.FC<ChartsSectionProps> = ({ viewsData, userGrowthData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Views Chart */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Views</h3>
      <SimpleChart title="Weekly Views" data={viewsData} />
    </div>

    {/* User Growth Chart */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
      <SimpleChart title="User Growth" data={userGrowthData} />
    </div>
  </div>
);
