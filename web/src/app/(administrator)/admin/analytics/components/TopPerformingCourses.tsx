import React from "react";
import { Award } from "lucide-react";
import { CourseCard } from "./CourseCard";

interface Course {
  title: string;
  instructor: string;
  enrollments: number;
  revenue: number;
  rating: number;
  completionRate: number;
}

interface TopPerformingCoursesProps {
  courses: Course[];
}

/**
 * Top performing courses component displaying course performance list
 */
export const TopPerformingCourses: React.FC<TopPerformingCoursesProps> = ({ courses }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Courses</h3>
      <Award className="w-5 h-5 text-yellow-500" />
    </div>
    <div className="space-y-4">
      {courses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
    </div>
  </div>
);
