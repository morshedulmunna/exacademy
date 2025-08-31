"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, User, Eye, Edit, Trash2, Wrench } from "lucide-react";

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
  status: "draft" | "published" | "archived";
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
export const CoursesTable: React.FC<CoursesTableProps> = ({ courses }) => {
  const router = useRouter();

  const openEdit = React.useCallback(
    (course: AdminCourseItem) => {
      router.push(`/admin/courses/${course.slug}/edit`);
    },
    [router]
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-hidden">
        <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-1/2 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
              <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Instructor</th>
              <th className="w-28 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Students</th>
              <th className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
              <th className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {courses.map((course) => (
              <CourseRow key={course.id} course={course} onEdit={openEdit} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal removed; navigates to dedicated edit page */}
    </div>
  );
};

/**
 * Individual course row component
 */
const CourseRow: React.FC<{ course: AdminCourseItem; onEdit: (course: AdminCourseItem) => void }> = ({ course, onEdit }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
    <td className="px-6 py-4 align-top">
      <div className="flex items-start">
        <div className="flex-shrink-0 h-16 w-16">
          <div className="h-16 w-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            {course.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.image} alt={course.title} className="h-16 w-16 object-cover" />
            ) : (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{course.title.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
        <div className="ml-4 min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{course.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 break-words">{course.excerpt}</div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-x-3 gap-y-1">
            <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300">${course.price.toFixed(2)}</span>
            <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300">★ {course.rating > 0 ? course.rating.toFixed(1) : "-"}</span>
            <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300">{course.totalLessons} lessons</span>
            {course.category && <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:text-gray-300">{course.category}</span>}
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 align-top">
      <div className="flex items-start">
        <User className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
        <div className="min-w-0">
          <div className="text-sm text-gray-900 dark:text-white truncate">{course.instructor?.name || "Unknown"}</div>
          {course.instructor?.email && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{course.instructor.email}</div>}
        </div>
      </div>
    </td>
    <td className="px-6 py-4 align-top">
      {course.status === "published" && <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Published</span>}
      {course.status === "draft" && <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Draft</span>}
      {course.status === "archived" && <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Archived</span>}
    </td>
    <td className="px-6 py-4 align-top">
      <div className="text-sm text-gray-900 dark:text-white">{course.students.toLocaleString()}</div>
    </td>
    <td className="px-6 py-4 align-top">
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
        <div className="text-sm text-gray-900 dark:text-white">{new Date(course.createdAt).toLocaleDateString()}</div>
      </div>
    </td>
    <td className="px-6 py-4 align-top text-sm font-medium">
      <div className="flex items-center space-x-2">
        <Link href={`/admin/courses/${course.slug}/builder`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" title="Builder">
          <Wrench className="w-4 h-4" />
        </Link>
        <Link href={`/courses/${course.slug}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View">
          <Eye className="w-4 h-4" />
        </Link>
        <button onClick={() => onEdit(course)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Edit">
          <Edit className="w-4 h-4" />
        </button>
        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </td>
  </tr>
);
