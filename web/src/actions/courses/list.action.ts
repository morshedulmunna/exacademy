"use server";

import FetchAPI from "@/actions/http";

export interface Paginated<T> {
  items: T[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
}

export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  price: number;
  original_price?: number | null;
  duration?: string | null;
  lessons?: number | null;
  students?: number | null;
  published: boolean;
  featured: boolean;
  view_count?: number | null;
  instructor_id?: string | null;
  instructor?: { id: string; username: string; full_name?: string | null; avatar_url?: string | null } | null;
  created_at: string;
  updated_at?: string | null;
}

/**
 * Lists courses for the authenticated instructor (paginated).
 * Backend endpoint: GET /api/v1/instructors/courses/list?page=&per_page=
 */
export async function listInstructorCourses(params?: { page?: number; per_page?: number }) {
  const page = params?.page ?? 1;
  const per_page = params?.per_page ?? 10;
  const endpoint = `/api/v1/instructors/courses/list?page=${page}&per_page=${per_page}`;
  const res = await FetchAPI.get({ endpoint });
  console.log(res?.data?.items);
  return res?.data as Paginated<CourseListItem>;
}
