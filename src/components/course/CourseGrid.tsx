import React from "react";
import CourseCard from "./CourseCard";
import CoursePagination from "./CoursePagination";

export default function CourseGrid() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
        <CourseCard />
      </div>
      <CoursePagination />
    </div>
  );
}
