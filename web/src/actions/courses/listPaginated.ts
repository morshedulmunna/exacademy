import ServerFetch, { ApiEnvelope } from "../http";
import type { Course } from "./getById";

export type PageMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

export type Page<T> = {
  items: T[];
  meta: PageMeta;
};

export async function listCoursesPaginated(page = 1, perPage = 10): Promise<Page<Course>> {
  const url = `/api/courses/paginated?page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(perPage)}`;
  const res = await ServerFetch<ApiEnvelope<Page<Course>>>(url);
  return res.data;
}

export default listCoursesPaginated;
