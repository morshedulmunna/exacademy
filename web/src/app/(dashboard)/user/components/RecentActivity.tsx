import React from "react";
import { BookOpen, Play, CheckCircle, Award, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: "lesson_completed" | "course_enrolled" | "certificate_earned" | "quiz_passed";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

/**
 * Recent activity component showing learning activities
 */
export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lesson_completed":
        return { icon: <CheckCircle className="w-4 h-4" />, color: "text-green-600 dark:text-green-400" };
      case "course_enrolled":
        return { icon: <BookOpen className="w-4 h-4" />, color: "text-blue-600 dark:text-blue-400" };
      case "certificate_earned":
        return { icon: <Award className="w-4 h-4" />, color: "text-yellow-600 dark:text-yellow-400" };
      case "quiz_passed":
        return { icon: <Play className="w-4 h-4" />, color: "text-purple-600 dark:text-purple-400" };
      default:
        return { icon: <Clock className="w-4 h-4" />, color: "text-gray-600 dark:text-gray-400" };
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No recent activity</h3>
          <p className="text-gray-600 dark:text-gray-400">Start learning to see your activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const { icon, color } = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ${color}`}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
