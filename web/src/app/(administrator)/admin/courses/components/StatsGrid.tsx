import React from "react";
import { BookOpen, Eye as EyeIcon, Users, DollarSign, Star, EyeOff } from "lucide-react";
import { StatCard } from "./StatCard";

interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}

interface StatsGridProps {
  stats: CourseStats;
}

/**
 * Statistics grid component displaying course metrics
 */
export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<BookOpen className="w-6 h-6" />}
        label="Total Courses"
        value={stats.totalCourses}
        bgColor="bg-blue-100 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        icon={<EyeIcon className="w-6 h-6" />}
        label="Published"
        value={stats.publishedCourses}
        bgColor="bg-green-100 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
      />
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="Total Students"
        value={stats.totalStudents}
        bgColor="bg-yellow-100 dark:bg-yellow-900/20"
        iconColor="text-yellow-600 dark:text-yellow-400"
      />
      <StatCard
        icon={<DollarSign className="w-6 h-6" />}
        label="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        bgColor="bg-purple-100 dark:bg-purple-900/20"
        iconColor="text-purple-600 dark:text-purple-400"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        icon={<Star className="w-6 h-6" />}
        label="Average Rating"
        value={stats.averageRating.toFixed(1)}
        bgColor="bg-orange-100 dark:bg-orange-900/20"
        iconColor="text-orange-600 dark:text-orange-400"
      />
      <StatCard
        icon={<EyeOff className="w-6 h-6" />}
        label="Draft Courses"
        value={stats.draftCourses}
        bgColor="bg-red-100 dark:bg-red-900/20"
        iconColor="text-red-600 dark:text-red-400"
      />
    </div>
  </>
);

