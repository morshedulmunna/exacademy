"use server";

import FetchAPI from "@/actions/http";

/**
 * Lists courses for the authenticated instructor (paginated).
 * Backend endpoint: GET /api/v1/instructors/courses/list?page=&per_page=
 */
export async function listInstructorCourses(params?: { page?: number; per_page?: number }) {
  const page = params?.page ?? 1;
  const per_page = params?.per_page ?? 10;
  const endpoint = `/api/v1/instructors/courses/list?page=${page}&per_page=${per_page}`;
  return FetchAPI.get({ endpoint });
}
