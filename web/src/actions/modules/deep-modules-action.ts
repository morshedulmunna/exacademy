"use server";

import API from "@/configs/api.config";

/**
 * Delete a course by id via backend API
 * @param courseId - The ID of the course to delete
 */
export async function createDeepModules(courseId: string, payload: any): Promise<any> {
  try {
    const res = await API.post(`/api/courses/${courseId}/modules/deep`, payload);
    return res;
  } catch (error: any) {
    const message: string = error?.response?.data?.message || error?.message || "Failed to delete course";
    return { success: false, message };
  }
}
