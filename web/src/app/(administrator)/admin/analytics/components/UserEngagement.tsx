import React from "react";
import { PieChart } from "lucide-react";
import { EngagementItem } from "./EngagementItem";
import { EngagementSummary } from "./EngagementSummary";

interface EngagementData {
  label: string;
  value: number;
  color: string;
}

interface UserEngagementProps {
  engagementData: EngagementData[];
}

/**
 * User engagement component displaying engagement metrics and summary
 */
export const UserEngagement: React.FC<UserEngagementProps> = ({ engagementData }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Engagement</h3>
      <PieChart className="w-5 h-5 text-blue-500" />
    </div>
    <div className="space-y-4">
      {engagementData.map((item, index) => (
        <EngagementItem key={index} label={item.label} value={item.value} color={item.color} />
      ))}
    </div>
    <EngagementSummary />
  </div>
);
