import React from "react";
import { PageHeader, CoursesAnalytics, CoursesKpis, PaginatedCoursesTable } from "./components";
import { getInstructorCoursesAction } from "@/actions/courses/get-course.action";
import type { AdminCourseItem } from "./components/CoursesTable";

/**
 * Course Management Page
 * Clean, component-based admin interface for managing courses
 */
export default async function CourseManagementPage() {
  const { success, data } = await getInstructorCoursesAction({ page: 1, per_page: 50 });

  const parseDurationHours = (duration?: string): number => {
    if (!duration) return 0;
    const match = duration.match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  const toAdminCourseItem = (c: any): AdminCourseItem => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    excerpt: c.excerpt || "",
    instructor: { name: c.instructor?.full_name || c.instructor?.username || "Unknown" },
    status: (c.status as any) || (c.published ? "published" : "draft"),
    price: Number(c.price || 0),
    students: Number(c.students || 0),
    rating: 0,
    totalLessons: Number(c.lessons || 0),
    totalDuration: parseDurationHours(c.duration),
    category: "",
    createdAt: c.created_at,
    image: c.thumbnail || undefined,
  });

  const courses: AdminCourseItem[] = success ? (data?.items || []).map(toAdminCourseItem) : [];

  const stats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.status === "published").length,
    draftCourses: courses.filter((c) => c.status === "draft").length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    totalRevenue: courses.reduce((sum, c) => sum + c.price * c.students, 0),
    averageRating: courses.filter((c) => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) / (courses.filter((c) => c.rating > 0).length || 1),
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Course Management" subtitle="Manage your courses, track enrollments, and monitor performance" newCourseUrl="/admin/courses/new" />
      <CoursesKpis totalCourses={stats.totalCourses} publishedCourses={stats.publishedCourses} draftCourses={stats.draftCourses} totalStudents={stats.totalStudents} totalRevenue={stats.totalRevenue} averageRating={stats.averageRating} />
      <CoursesAnalytics totalRevenue={stats.totalRevenue} />
      <PaginatedCoursesTable courses={courses} pageSize={10} />
    </div>
  );
}
