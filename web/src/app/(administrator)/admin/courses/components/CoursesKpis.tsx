import React from "react";
import { BookOpen, Users, DollarSign, Star, Eye, EyeOff } from "lucide-react";

interface CoursesKpisProps {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}

/**
 * CoursesKpis
 * Lightweight KPI cards for quick stats.
 */
export const CoursesKpis: React.FC<CoursesKpisProps> = ({ totalCourses, publishedCourses, draftCourses, totalStudents, totalRevenue, averageRating }) => {
  const cards = [
    { icon: <BookOpen className="w-5 h-5" />, label: "Total Courses", value: totalCourses, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: <Eye className="w-5 h-5" />, label: "Published", value: publishedCourses, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { icon: <EyeOff className="w-5 h-5" />, label: "Drafts", value: draftCourses, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { icon: <Users className="w-5 h-5" />, label: "Students", value: totalStudents, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { icon: <Star className="w-5 h-5" />, label: "Avg. Rating", value: averageRating.toFixed(1), color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className={`p-2 rounded-md ${c.bg} ${c.color}`}>{c.icon}</div>
            <div className="ml-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{c.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
