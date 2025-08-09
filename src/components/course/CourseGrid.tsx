import React from "react";
import CourseCard, { CourseCardProps } from "./CourseCard";
import CoursePagination from "./CoursePagination";

interface CourseGridProps {
  courses: CourseCardProps[];
  showPagination?: boolean;
}

export default function CourseGrid({ courses, showPagination = false }: CourseGridProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 && <p className="text-muted-foreground">No courses found.</p>}
        {courses.map((c) => (
          <CourseCard key={c.slug} {...c} />
        ))}
      </div>
      {showPagination && <CoursePagination />}
    </div>
  );
}
