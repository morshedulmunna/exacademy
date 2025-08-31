"use server";

import API from "@/configs/api.config";
import { API_ENDPOINTS } from "@/configs/api-path";
import { DataObj, ErrorObj } from "@/lib/utils";

/**
 * getSingleCourseDetailsBySlug
 * Fetch a single course by its slug for the public course details page.
 */
export async function getSingleCourseDetailsBySlug(slug: string) {
  try {
    // Backend endpoint is singular: /api/course/:slug
    const url = `${API_ENDPOINTS.COURSES.DETAIL.replace("/api/courses", "/api/course")}/${encodeURIComponent(slug)}`;
    const res = await API.get(url);
    return DataObj(res) as any;
  } catch (error) {
    return ErrorObj(error) as any;
  }
}
