import React from "react";
import Link from "next/link";
import { Calendar, User, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";

interface Instructor {
  name: string;
  email?: string;
}

export interface AdminCourseItem {
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
  totalDuration: number; // hours
  category: string;
  createdAt: string; // ISO date
  image?: string;
}

interface CoursesTableProps {
  courses: AdminCourseItem[];
}

/**
 * Admin Courses table component
 * Presents a compact, scannable list alternative to card grid
 */
export const CoursesTable: React.FC<CoursesTableProps> = ({ courses }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Instructor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Students</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lessons</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {courses.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/**
 * Individual course row component
 */
const CourseRow: React.FC<{ course: AdminCourseItem }> = ({ course }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            {course.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.image} alt={course.title} className="h-10 w-10 object-cover" />
            ) : (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{course.title.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">{course.excerpt}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <User className="w-4 h-4 text-gray-400 mr-2" />
        <div>
          <div className="text-sm text-gray-900 dark:text-white">{course.instructor?.name || "Unknown"}</div>
          {course.instructor?.email && <div className="text-xs text-gray-500 dark:text-gray-400">{course.instructor.email}</div>}
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.published ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
        {course.published ? "Published" : "Draft"}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{course.students.toLocaleString()}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">
        ${""}
        {course.price.toFixed(2)}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{course.rating > 0 ? course.rating.toFixed(1) : "-"}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{course.totalLessons}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{course.totalDuration}h</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 dark:text-white">{course.category}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
        <div className="text-sm text-gray-900 dark:text-white">{new Date(course.createdAt).toLocaleDateString()}</div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center space-x-2">
        <Link href={`/courses/${course.slug}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View">
          <Eye className="w-4 h-4" />
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
    </td>
  </tr>
);
