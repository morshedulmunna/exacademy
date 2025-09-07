"use server";

import API from "@/configs/api.config";
import { DataObj } from "@/lib/utils";

/**
 * Fetch modules (shallow) for a course via backend API
 * @param courseId - The ID of the course
 */
export async function listModules(courseId: string): Promise<any> {
  try {
    const res = await API.get(`/api/courses/${courseId}/modules`);
    const data = DataObj(res);
    return { success: true, data: data.data } as const;
  } catch (error: any) {
    console.error("Error fetching modules:", error);
    const message: string = error?.response?.data?.message || error?.message || "Failed to fetch modules";
    return { success: false, message } as const;
  }
}
