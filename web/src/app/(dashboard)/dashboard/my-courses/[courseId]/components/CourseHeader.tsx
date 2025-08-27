import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, User, Star } from "lucide-react";

interface CourseHeaderProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    totalDuration: number;
    rating: number;
    category: string;
  };
}

/**
 * Course header component for course detail page
 */
export const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard/my-courses"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">by {course.instructor}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center space-x-1 mb-2">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{course.rating}</span>
        </div>
        <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full">
          {course.category}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.totalLessons}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Total Lessons</p>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.completedLessons}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
          <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.totalDuration}h</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
      </div>

      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.progress}%</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
      </div>
    </div>

    <div className="mt-6">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
        <span>Course Progress</span>
        <span>{course.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
    </div>
  </div>
);
