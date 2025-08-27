import React from "react";
import Link from "next/link";
import { Star, Users, Clock, BookOpen } from "lucide-react";

interface RecommendedCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  totalStudents: number;
  price: number;
  duration: number;
  category: string;
  isEnrolled: boolean;
}

interface RecommendedCoursesProps {
  courses: RecommendedCourse[];
}

/**
 * Recommended courses component for learners
 */
export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({ courses }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended for You</h2>
      <Link href="/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        Browse all courses
      </Link>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-video bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full">
                {course.category}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{course.rating}</span>
              </div>
            </div>
            
            <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-2">
              {course.title}
            </h3>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {course.instructor}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{course.totalStudents} students</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{course.duration}h</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${course.price}
              </span>
              
              {course.isEnrolled ? (
                <span className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-md">
                  Enrolled
                </span>
              ) : (
                <Link 
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                >
                  View Course
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
