"use server";

import { httpClient } from "@/actions/http";

/**
 * Delete a course by ID
 * @param courseId - The UUID of the course to delete
 * @returns Promise with the delete response
 */
export async function deleteCourse(courseId: string): Promise<any> {
  try {
    const response = await httpClient.delete(`/api/courses/${courseId}`);
    return response;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw new Error("Failed to delete course");
  }
}
