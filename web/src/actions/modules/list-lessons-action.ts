"use server";

import API from "@/configs/api.config";
import { DataObj } from "@/lib/utils";

/**
 * Fetch lessons for a specific module via backend API
 * @param moduleId - The ID of the module
 */
export async function listLessonsByModule(moduleId: string): Promise<any> {
  try {
    const res = await API.get(`/api/modules/${moduleId}/lessons`);
    const data = DataObj(res);
    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Error fetching lessons:", error);
    const message: string = error?.response?.data?.message || error?.message || "Failed to fetch lessons";
    return { success: false, message };
  }
}
