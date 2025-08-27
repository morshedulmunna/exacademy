import React from "react";
import { SimpleChart } from "../../_@components";

interface ChartData {
  label: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  data: ChartData[];
}

/**
 * Individual chart card component with title and chart
 */
export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, icon, data }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        {icon}
        <span>{subtitle}</span>
      </div>
    </div>
    <SimpleChart title={title} data={data} />
  </div>
);
