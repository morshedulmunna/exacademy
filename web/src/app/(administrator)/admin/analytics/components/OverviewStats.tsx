import React from "react";
import { DollarSign, Users, BookOpen, BarChart3 } from "lucide-react";
import { StatCard } from "./StatCard";

interface OverviewStatsData {
  totalRevenue: number;
  totalUsers: number;
  totalCourses: number;
  totalPosts: number;
  monthlyGrowth: number;
  userGrowth: number;
  courseGrowth: number;
  postGrowth: number;
}

interface OverviewStatsProps {
  stats: OverviewStatsData;
}

/**
 * Overview statistics grid component
 */
export const OverviewStats: React.FC<OverviewStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      title="Total Revenue"
      value={`$${stats.totalRevenue.toLocaleString()}`}
      growth={stats.monthlyGrowth}
      icon={<DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />}
      bgColor="bg-green-100 dark:bg-green-900/20"
    />
    <StatCard
      title="Total Users"
      value={stats.totalUsers.toLocaleString()}
      growth={stats.userGrowth}
      icon={<Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
      bgColor="bg-blue-100 dark:bg-blue-900/20"
    />
    <StatCard
      title="Total Courses"
      value={stats.totalCourses}
      growth={stats.courseGrowth}
      icon={<BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
      bgColor="bg-purple-100 dark:bg-purple-900/20"
    />
    <StatCard
      title="Total Posts"
      value={stats.totalPosts}
      growth={stats.postGrowth}
      icon={<BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />}
      bgColor="bg-orange-100 dark:bg-orange-900/20"
    />
  </div>
);
