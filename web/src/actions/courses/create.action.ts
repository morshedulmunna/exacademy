"use server";

import FetchAPI from "@/actions/http";

/**
 * CreateCoursePayload defines the expected payload to create a course
 * aligned with the backend API contract.
 */
export interface CreateCoursePayload {
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  thumbnail?: string;
  price: number;
  original_price?: number;
  duration?: string;
  lessons?: number;
  featured?: boolean;
  instructor_id?: string | null;
}

/**
 * Calls POST /api/courses and returns the created course id (uuid as string).
 */
export async function createCourse(payload: CreateCoursePayload): Promise<string> {
  try {
    // Sanitize thumbnail: include only if it looks like a URL (backend expects URL)
    const safePayload: CreateCoursePayload = {
      ...payload,
      thumbnail: payload.thumbnail && /^(https?:)?\/\//i.test(payload.thumbnail) ? payload.thumbnail : undefined,
    };

    const res = await FetchAPI.post({ endpoint: "/api/courses", body: safePayload });
    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
