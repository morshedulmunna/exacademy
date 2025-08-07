import React from "react";
import CourseCard from "./CourseCard";

type Props = object;

export default function MoreCoursesByInstructor({}: Props) {
  return (
    <>
      <div className="mt-8">
        <h3 className="dark:text-white text-gray-900 font-semibold text-xl mb-6">More courses by Habibur Rahman</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div>
    </>
  );
}
