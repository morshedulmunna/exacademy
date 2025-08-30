import React from "react";
import NewCourseForm from "./NewCourseForm";

/**
 * New Course Page
 * Server-rendered page hosting a minimal course creation form.
 * On successful creation redirects to the course builder.
 */
export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create New Course</h1>
      <NewCourseForm />
    </div>
  );
}
