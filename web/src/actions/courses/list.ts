import ServerFetch, { ApiEnvelope } from "../http";
import type { Course } from "./getById";

export async function listCourses(): Promise<Course[]> {
  const res = await ServerFetch<ApiEnvelope<Course[]>>("/api/courses");
  return res.data;
}

export default listCourses;
