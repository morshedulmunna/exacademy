"use server";

import API from "@/configs/api.config";
import { API_ENDPOINTS } from "@/configs/api-path";
import { DataObj, ErrorObj } from "@/lib/utils";

/**
 * getInstructorCoursesAction
 * Fetch paginated courses for the authenticated instructor.
 */
export async function getInstructorCoursesAction({ page = 1, per_page = 50 }: { page?: number; per_page?: number } = {}) {
  try {
    const res = await API.get(`/api/instructors/courses/list`, { params: { page, per_page } });
    return DataObj(res) as any;
  } catch (error) {
    return ErrorObj(error) as any;
  }
}

/**
 * getCourseBySlugAction
 * Fetch a single course by slug.
 */
export async function getCourseBySlugAction(slug: string) {
  try {
    const res = await API.get(`${API_ENDPOINTS.COURSES.DETAIL.replace("/api/courses", "/api/course")}/${encodeURIComponent(slug)}`);
    return DataObj(res) as any;
  } catch (error) {
    return ErrorObj(error) as any;
  }
}
