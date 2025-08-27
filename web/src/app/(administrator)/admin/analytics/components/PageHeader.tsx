import React from "react";
import { Calendar } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  timeRange: string;
}

/**
 * Page header component for analytics pages
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, timeRange }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
    </div>
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <Calendar className="w-4 h-4" />
      <span>{timeRange}</span>
    </div>
  </div>
);
