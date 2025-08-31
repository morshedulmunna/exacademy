"use server";

import API from "@/configs/api.config";
import { API_ENDPOINTS } from "@/configs/api-path";
import { DataObj, ErrorObj } from "@/lib/utils";

/**
 * updateCourseAction
 * Server action to update a course by id with partial fields.
 */
export async function updateCourseAction(id: string, payload: FormData) {
  try {
    const res = await API.patch(`${API_ENDPOINTS.COURSES.UPDATE}/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { ...(DataObj(res) as any) } as const;
  } catch (error) {
    return { ...(ErrorObj(error) as any) } as const;
  }
}
