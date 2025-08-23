import ServerFetch, { ApiEnvelope } from "../http";
import type { Course } from "./getById";

export async function getCourseBySlug(slug: string): Promise<Course> {
  const res = await ServerFetch<ApiEnvelope<Course>>(`/api/course/${slug}`);
  return res.data;
}

export default getCourseBySlug;
