"use server";

import API from "@/configs/api.config";

/**
 * Fetch modules with nested lessons for a course via backend API
 * @param courseId - The ID of the course
 */
export async function listModulesDeep(courseId: string): Promise<any> {
  try {
    const res = await API.get(`/api/courses/${courseId}/modules/deep`);
    return { success: true, data: res.data };
  } catch (error: any) {
    console.error("Error fetching modules:", error);
    const message: string = error?.response?.data?.message || error?.message || "Failed to fetch modules";
    return { success: false, message };
  }
}
