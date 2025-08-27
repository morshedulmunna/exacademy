import React from "react";
import Link from "next/link";
import { BookOpen, Clock, Play, ArrowRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  totalDuration: number;
  lastAccessed: string;
}

interface CurrentCoursesProps {
  courses: Course[];
}

/**
 * Clean current courses component following Udemy design
 */
export const CurrentCourses: React.FC<CurrentCoursesProps> = ({ courses }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
      <Link href="/dashboard/my-courses" className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        <span>View all courses</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>

    {courses.length === 0 ? (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No courses yet</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">Start your learning journey by enrolling in a course</p>
        <Link href="/courses" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Browse Courses
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{course.instructor}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Progress</span>
                    <span className="font-semibold text-white">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${course.progress}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Play className="w-4 h-4 text-purple-400" />
                      <span>
                        {course.completedLessons}/{course.totalLessons} lessons
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>{course.totalDuration}h</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                  <Link href={`/dashboard/my-courses/${course.id}`} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
