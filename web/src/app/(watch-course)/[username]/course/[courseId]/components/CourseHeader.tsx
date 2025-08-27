import React from "react";
import { BookOpen, Clock, Play, Star, User } from "lucide-react";

interface Course {
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
}

interface CourseHeaderProps {
  course: Course;
}

/**
 * Course header component for course detail page
 */
export const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
      {/* Course Thumbnail */}
      <div className="w-full lg:w-64 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <BookOpen className="w-16 h-16 text-white" />
      </div>

      {/* Course Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">{course.category}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{course.title}</h1>

        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{course.instructor}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-gray-600 dark:text-gray-400">{course.rating}</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{course.progress}% complete</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.totalDuration}h remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-3 w-full lg:w-auto">
        <button className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2">
          <Play className="w-5 h-5" />
          <span>Continue Learning</span>
        </button>

        <button className="w-full lg:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">View Course Overview</button>
      </div>
    </div>
  </div>
);
