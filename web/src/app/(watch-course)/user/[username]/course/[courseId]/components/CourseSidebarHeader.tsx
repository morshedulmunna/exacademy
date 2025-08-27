import React from "react";
import { MessageSquare, MoreVertical } from "lucide-react";

interface CourseSidebarHeaderProps {
  totalLessons: number;
  totalDuration: string;
  progressPercentage: number;
}

/**
 * Header component for the course sidebar showing progress and metadata
 */
export const CourseSidebarHeader: React.FC<CourseSidebarHeaderProps> = ({ totalLessons, totalDuration, progressPercentage }) => {
  return (
    <div className="p-4 lg:p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course content</h3>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{totalLessons} lectures</span>
        <span>{totalDuration}</span>
      </div>

      {/* Overall Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Overall Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};
