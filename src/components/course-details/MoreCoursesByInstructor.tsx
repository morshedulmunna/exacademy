import React from "react";
import CourseCard from "./CourseCard";
import type { Course } from "@/lib/types";

type Props = {
  instructorName?: string;
  courses?: Course[];
};

export default function MoreCoursesByInstructor({ instructorName, courses = [] }: Props) {
  return (
    <>
      <div className="mt-8">
        <h3 className="dark:text-white text-gray-900 font-semibold text-xl mb-6">More courses by {instructorName}</h3>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <p className="text-sm dark:text-gray-400 text-gray-500">No other courses found.</p>
        )}
      </div>
    </>
  );
}
