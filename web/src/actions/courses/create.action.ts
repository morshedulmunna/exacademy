"use server";

import API from "@/configs/api.config";
import { API_ENDPOINTS } from "@/configs/api-path";
import { DataObj, ErrorObj } from "@/lib/utils";

/**
 * createCourseAction
 * Server action that creates a course and returns created id.
 */
export async function createCourseAction(payload: any) {
  try {
    const res = await API.post(API_ENDPOINTS.COURSES.CREATE, payload, { responseType: "text" });
    return { success: true, id: String(res.data) } as const;
  } catch (error) {
    return { success: false, ...(ErrorObj(error) as any) } as const;
  }
}

/**
 * createModuleAction
 * Creates a module for a given course id and returns created id.
 */
export async function createModuleAction(courseId: string, payload: { title: string; description?: string; position: number }) {
  try {
    const res = await API.post(`/api/courses/${courseId}/modules`, payload, { responseType: "text" });
    return { success: true, id: String(res.data) } as const;
  } catch (error) {
    return { success: false, ...(ErrorObj(error) as any) } as const;
  }
}

/**
 * createLessonAction
 * Creates a lesson under a module and returns created id.
 */
export async function createLessonAction(moduleId: string, payload: { title: string; duration: string; position: number; is_free: boolean; published: boolean; description?: string; content?: string; video_url?: string }) {
  try {
    const res = await API.post(`/api/modules/${moduleId}/lessons`, { module_id: moduleId, ...payload }, { responseType: "text" });
    return { success: true, id: String(res.data) } as const;
  } catch (error) {
    return { success: false, ...(ErrorObj(error) as any) } as const;
  }
}
