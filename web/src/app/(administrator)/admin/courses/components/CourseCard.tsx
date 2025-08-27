import React from "react";
import Link from "next/link";
import { BookOpen, Users, Clock, Star, Eye as EyeIcon, Edit, Trash2, MoreHorizontal } from "lucide-react";

interface Instructor {
  name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  instructor: Instructor;
  published: boolean;
  price: number;
  students: number;
  rating: number;
  totalLessons: number;
  totalDuration: number;
  category: string;
  createdAt: string;
  image: string;
}

interface CourseCardProps {
  course: Course;
}

/**
 * Individual course card component
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
    {/* Course Image */}
    <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      </div>
    </div>

    {/* Course Content */}
    <div className="p-6">
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          course.published 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        }`}>
          {course.published ? "Published" : "Draft"}
        </span>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{course.rating}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {course.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {course.excerpt}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{course.students}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.totalLessons}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{course.totalDuration}h</span>
          </div>
        </div>
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          ${course.price}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div className="font-medium">{course.instructor.name}</div>
          <div>{course.category}</div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link href={`/courses/${course.slug}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View">
            <EyeIcon className="w-4 h-4" />
          </Link>
          <Link href={`/admin/courses/${course.slug}/edit`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Edit">
            <Edit className="w-4 h-4" />
          </Link>
          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" title="More">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

