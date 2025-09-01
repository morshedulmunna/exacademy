"use server";

import { API } from "@/configs/api.config";

/**
 * Delete a module by ID
 * @param moduleId - The UUID of the module to delete
 * @returns Promise that resolves when the module is deleted
 */
export async function deleteModuleAction(moduleId: string): Promise<void> {
  try {
    await API.delete(`/api/modules/${moduleId}`);
  } catch (error) {
    console.error("Failed to delete module:", error);
    throw new Error("Failed to delete module. Please try again.");
  }
}
