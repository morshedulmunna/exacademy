import React from "react";
import { ActivityIcon } from "./ActivityIcon";

interface Activity {
  type: string;
  user: string;
  course: string | null;
  time: string;
  revenue: number;
}

interface ActivityItemProps {
  activity: Activity;
}

/**
 * Individual activity item component displaying user activity information
 */
export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => (
  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
    <div className="flex items-center space-x-3">
      <ActivityIcon type={activity.type} />
      <div>
        <p className="text-sm text-gray-900 dark:text-white">
          <span className="font-medium">{activity.user}</span>
          {activity.type === "course_enrollment" && ` enrolled in `}
          {activity.type === "new_user" && ` joined the platform`}
          {activity.type === "course_completion" && ` completed `}
          {activity.course && <span className="font-medium">{activity.course}</span>}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
      </div>
    </div>
    {activity.revenue > 0 && <span className="text-sm font-semibold text-green-600 dark:text-green-400">+${activity.revenue}</span>}
  </div>
);
