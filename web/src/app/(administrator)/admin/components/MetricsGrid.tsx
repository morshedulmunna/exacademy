import React from "react";
import { Eye, Users, BookOpen, Clock } from "lucide-react";

interface MetricsGridProps {
  totalViews: number;
  engagementRate: string;
  publishRate: string;
}

/**
 * Key metrics grid component
 */
export const MetricsGrid: React.FC<MetricsGridProps> = ({ totalViews, engagementRate, publishRate }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Total Views */}
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Views</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews.toLocaleString()}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">+8.2% from last week</p>
        </div>
        <Eye className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    </div>

    {/* Engagement Rate */}
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Engagement Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{engagementRate}%</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Per user average</p>
        </div>
        <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    </div>

    {/* Publish Rate */}
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Publish Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{publishRate}%</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Content completion</p>
        </div>
        <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    </div>

    {/* Course Completion */}
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Course Completion</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Student success rate</p>
        </div>
        <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  </div>
);
