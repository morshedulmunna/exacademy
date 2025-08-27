import React from "react";

interface Course {
  title: string;
  instructor: string;
  enrollments: number;
  revenue: number;
  rating: number;
  completionRate: number;
}

interface CourseCardProps {
  course: Course;
}

/**
 * Individual course card component displaying course performance metrics
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
    <div className="flex-1">
      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{course.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400">{course.instructor}</p>
      <div className="flex items-center space-x-4 mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">{course.enrollments} students</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{course.rating}★</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{course.completionRate}% completion</span>
      </div>
    </div>
    <div className="text-right">
      <p className="font-semibold text-gray-900 dark:text-white">${course.revenue}</p>
    </div>
  </div>
);
