import React from "react";
import { PageHeader, StatsGrid, SearchFilters, CoursesGrid } from "./components";

/**
 * Course Management Page
 * Clean, component-based admin interface for managing courses
 */
export default function CourseManagementPage() {
  // Static sample data
  const courses = [
    {
      id: "c1",
      title: "Complete Web Development Bootcamp",
      slug: "web-development-bootcamp",
      excerpt: "Learn web development from scratch with HTML, CSS, JavaScript, and modern frameworks",
      instructor: { name: "Sarah Wilson", email: "sarah@example.com" },
      published: true,
      price: 99.99,
      students: 45,
      rating: 4.8,
      totalLessons: 24,
      totalDuration: 18,
      category: "Web Development",
      createdAt: "2024-01-10",
      image: "/api/placeholder/300/200",
    },
    {
      id: "c2",
      title: "React Masterclass",
      slug: "react-masterclass",
      excerpt: "Master React with hooks, context, and advanced patterns for production apps",
      instructor: { name: "David Lee", email: "david@example.com" },
      published: true,
      price: 79.99,
      students: 32,
      rating: 4.9,
      totalLessons: 18,
      totalDuration: 12,
      category: "Frontend",
      createdAt: "2024-01-08",
      image: "/api/placeholder/300/200",
    },
    {
      id: "c3",
      title: "Advanced JavaScript",
      slug: "advanced-javascript",
      excerpt: "Deep dive into JavaScript ES6+, async programming, and design patterns",
      instructor: { name: "Lisa Chen", email: "lisa@example.com" },
      published: false,
      price: 69.99,
      students: 0,
      rating: 0,
      totalLessons: 15,
      totalDuration: 10,
      category: "JavaScript",
      createdAt: "2024-01-05",
      image: "/api/placeholder/300/200",
    },
    {
      id: "c4",
      title: "Node.js Backend Development",
      slug: "nodejs-backend-development",
      excerpt: "Build scalable backend services with Node.js, Express, and MongoDB",
      instructor: { name: "Mike Johnson", email: "mike@example.com" },
      published: true,
      price: 89.99,
      students: 28,
      rating: 4.7,
      totalLessons: 20,
      totalDuration: 15,
      category: "Backend",
      createdAt: "2024-01-03",
      image: "/api/placeholder/300/200",
    },
    {
      id: "c5",
      title: "UI/UX Design Fundamentals",
      slug: "ui-ux-design-fundamentals",
      excerpt: "Learn the principles of user interface and user experience design",
      instructor: { name: "Alex Brown", email: "alex@example.com" },
      published: true,
      price: 59.99,
      students: 38,
      rating: 4.6,
      totalLessons: 16,
      totalDuration: 8,
      category: "Design",
      createdAt: "2024-01-01",
      image: "/api/placeholder/300/200",
    },
  ];

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.published).length,
    draftCourses: courses.filter((c) => !c.published).length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    totalRevenue: courses.reduce((sum, c) => sum + c.price * c.students, 0),
    averageRating: courses.filter((c) => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / courses.filter((c) => c.rating > 0).length || 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Course Management" subtitle="Manage your courses, track enrollments, and monitor performance" newCourseUrl="/admin/courses/new" />

      <StatsGrid stats={stats} />
      <SearchFilters />
      <CoursesGrid courses={courses} />
    </div>
  );
}
