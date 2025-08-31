"use server";

import API from "@/configs/api.config";

/**
 * Delete a course by id via backend API
 * @param courseId - The ID of the course to delete
 */
export async function deleteCourse(courseId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await API.delete(`/api/courses/${courseId}`);
    const message: string = res?.data?.message || "Course deleted successfully";
    return { success: true, message };
  } catch (error: any) {
    const message: string = error?.response?.data?.message || error?.message || "Failed to delete course";
    return { success: false, message };
  }
}
