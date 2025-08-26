"use client";

import React from "react";
import Link from "next/link";
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import DeleteCourseButton from "./DeleteCourseButton";

interface CourseActionsProps {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
}

/**
 * Course Actions Component
 * Handles all course actions including view, edit, and delete
 */
export default function CourseActions({ courseId, courseTitle, courseSlug }: CourseActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <Link 
        href={`/course/${courseSlug}`} 
        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" 
        title="View Course"
      >
        <Eye className="w-4 h-4" />
      </Link>
      <Link 
        href={`/admin-handler/courses/${courseId}/edit`} 
        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" 
        title="Edit Course"
      >
        <Edit className="w-4 h-4" />
      </Link>
      <DeleteCourseButton 
        courseId={courseId} 
        courseTitle={courseTitle}
      />
      <button 
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" 
        title="More Options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
