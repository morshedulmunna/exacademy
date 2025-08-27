import React from "react";
import { CourseCard } from "./CourseCard";

interface Instructor {
  name: string;
  email: string;
}

interface Course {
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
  totalDuration: number;
  category: string;
  createdAt: string;
  image: string;
}

interface CoursesGridProps {
  courses: Course[];
}

/**
 * Courses grid component displaying course cards
 */
export const CoursesGrid: React.FC<CoursesGridProps> = ({ courses }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {courses.map((course) => (
      <CourseCard key={course.id} course={course} />
    ))}
  </div>
);

