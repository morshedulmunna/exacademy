import React from "react";
import { BookOpen, Clock, Award, Target, TrendingUp } from "lucide-react";

interface ProgressOverviewProps {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
  currentStreak: number;
}

/**
 * Clean progress overview component following Udemy design
 */
export const ProgressOverview: React.FC<ProgressOverviewProps> = ({ totalCourses, completedCourses, totalHours, certificates, currentStreak }) => {
  const completionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  const stats = [
    {
      icon: BookOpen,
      value: totalCourses,
      label: "Total Courses",
      color: "text-blue-500",
    },
    {
      icon: Target,
      value: `${completionRate}%`,
      label: "Completion Rate",
      color: "text-green-500",
    },
    {
      icon: Clock,
      value: `${totalHours}h`,
      label: "Total Hours",
      color: "text-purple-500",
    },
    {
      icon: Award,
      value: certificates,
      label: "Certificates",
      color: "text-yellow-500",
    },
    {
      icon: TrendingUp,
      value: currentStreak,
      label: "Day Streak",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Learning Progress</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>+12.5% from last month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
