"use server";

import API from "@/configs/api.config";
import { API_ENDPOINTS } from "@/configs/api-path";
import { DataObj, ErrorObj } from "@/lib/utils";

/**
 * updateCourseAction
 * Server action to update a course by id with partial fields.
 */
export async function updateCourseAction(
  id: string,
  payload: {
    title?: string;
    description?: string;
    excerpt?: string;
    thumbnail?: string;
    price?: number;
    original_price?: number;
    duration?: string;
    lessons?: number;
    students?: number;
    published?: boolean;
    featured?: boolean;
  }
) {
  try {
    const res = await API.patch(`${API_ENDPOINTS.COURSES.UPDATE}/${id}`, payload);
    return { ...(DataObj(res) as any) } as const;
  } catch (error) {
    return { ...(ErrorObj(error) as any) } as const;
  }
}
