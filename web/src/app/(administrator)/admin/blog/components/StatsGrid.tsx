import React from "react";
import { FileText, Eye, Clock } from "lucide-react";
import { StatCard } from "./StatCard";

interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalReadTime: number;
}

interface StatsGridProps {
  stats: BlogStats;
}

/**
 * Statistics grid component displaying blog metrics
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    <StatCard
      icon={<FileText className="w-6 h-6" />}
      label="Total Posts"
      value={stats.totalPosts}
      bgColor="bg-blue-100 dark:bg-blue-900/20"
      iconColor="text-blue-600 dark:text-blue-400"
    />
    <StatCard
      icon={<Eye className="w-6 h-6" />}
      label="Published"
      value={stats.publishedPosts}
      bgColor="bg-green-100 dark:bg-green-900/20"
      iconColor="text-green-600 dark:text-green-400"
    />
    <StatCard
      icon={<FileText className="w-6 h-6" />}
      label="Drafts"
      value={stats.draftPosts}
      bgColor="bg-yellow-100 dark:bg-yellow-900/20"
      iconColor="text-yellow-600 dark:text-yellow-400"
    />
    <StatCard
      icon={<Eye className="w-6 h-6" />}
      label="Total Views"
      value={stats.totalViews.toLocaleString()}
      bgColor="bg-purple-100 dark:bg-purple-900/20"
      iconColor="text-purple-600 dark:text-purple-400"
    />
    <StatCard
      icon={<Clock className="w-6 h-6" />}
      label="Total Read Time"
      value={`${stats.totalReadTime}h`}
      bgColor="bg-orange-100 dark:bg-orange-900/20"
      iconColor="text-orange-600 dark:text-orange-400"
    />
  </div>
);

