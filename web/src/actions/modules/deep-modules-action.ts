"use server";

import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";

/**
 * Create or update a module with nested lessons via backend API
 * @param courseId - The ID of the course
 * @param payload - The module data with nested lessons
 */
export async function createDeepModules(courseId: string, payload: any): Promise<any> {
  try {
    const res = await API.post(`/api/courses/${courseId}/modules/deep`, payload);
    return DataObj(res);
  } catch (error: any) {
    return ErrorObj(error);
  }
}
