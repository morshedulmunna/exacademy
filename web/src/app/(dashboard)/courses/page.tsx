"use client";

import React from "react";
import { PageHeader, CoursesGrid } from "./components";

/**
 * My Courses page following the "My learning" design
 */
export default function MyCoursesPage() {
  // Mock data matching the design
  const courses = [
    {
      id: "1",
      title: "Rust: The Complete Developer's Guide",
      instructor: "Stephen Grider",
      thumbnail: "",
      progress: 100,
      rating: 5,
      hasRating: true,
    },
    {
      id: "2",
      title: "Learn DevOps: The Complete Kubernetes Course",
      instructor: "Edward Viaene",
      thumbnail: "",
      progress: 8,
      hasRating: false,
    },
    {
      id: "3",
      title: "DevOps Beginners to Advanced with Projects",
      instructor: "Imran Teli",
      thumbnail: "",
      progress: 18,
      hasRating: false,
    },
    {
      id: "4",
      title: "Go: The Complete Developer's Guide (Golang)",
      instructor: "Stephen Grider",
      thumbnail: "",
      progress: 99,
      rating: 5,
      hasRating: true,
    },
    {
      id: "5",
      title: "Advanced DevOps with Kubernetes and Docker",
      instructor: "John Smith",
      thumbnail: "",
      progress: 45,
      hasRating: false,
    },
    {
      id: "6",
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Wilson",
      thumbnail: "",
      progress: 65,
      hasRating: false,
    },
    {
      id: "7",
      title: "React Masterclass 2024",
      instructor: "David Lee",
      thumbnail: "",
      progress: 30,
      hasRating: false,
    },
    {
      id: "8",
      title: "Python for Data Science",
      instructor: "Lisa Chen",
      thumbnail: "",
      progress: 75,
      hasRating: false,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader />
      <CoursesGrid courses={courses} />
    </div>
  );
}
