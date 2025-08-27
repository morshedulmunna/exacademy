import React from "react";
import { CourseCard } from "./CourseCard";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  rating?: number;
  hasRating: boolean;
}

interface CoursesGridProps {
  courses: Course[];
}

/**
 * Courses grid component following the "My learning" design
 */
export const CoursesGrid: React.FC<CoursesGridProps> = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No courses found</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="relative">
          <CourseCard course={course} />
        </div>
      ))}
    </div>
  );
};
