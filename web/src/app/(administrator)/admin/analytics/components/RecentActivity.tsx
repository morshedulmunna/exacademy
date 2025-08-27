import React from "react";
import { ActivityItem } from "./ActivityItem";

interface Activity {
  type: string;
  user: string;
  course: string | null;
  time: string;
  revenue: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

/**
 * Recent activity component displaying list of user activities
 */
export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  </div>
);
