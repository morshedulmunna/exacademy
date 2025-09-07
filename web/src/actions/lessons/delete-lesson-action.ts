"use server";

import { API } from "@/configs/api.config";

/**
 * Delete a lesson by ID
 * @param lessonId - The UUID of the lesson to delete
 * @returns Promise that resolves when the lesson is deleted
 */
export async function deleteLessonAction(lessonId: string): Promise<void> {
  try {
    await API.delete(`/api/lessons/${lessonId}`);
  } catch (error) {
    console.error("Failed to delete lesson:", error);
    throw new Error("Failed to delete lesson. Please try again.");
  }
}
