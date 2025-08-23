import ServerFetch, { ApiEnvelope } from "../http";
import type { Course } from "./getById";

export type UpdateCourseInput = Partial<{
  title: string;
  description: string;
  excerpt: string;
  thumbnail: string;
  price: number;
  original_price: number;
  duration: string;
  lessons: number;
  students: number;
  published: boolean;
  featured: boolean;
}>;

export async function updateCourse(id: string, input: UpdateCourseInput): Promise<Course> {
  const res = await ServerFetch<ApiEnvelope<Course>>(`/api/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return res.data;
}

export default updateCourse;
