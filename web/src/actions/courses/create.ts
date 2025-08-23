import ServerFetch, { ApiEnvelope } from "../http";

export type CreateCourseInput = {
  slug: string;
  title: string;
  description: string;
  excerpt?: string;
  thumbnail?: string;
  price: number;
  original_price?: number;
  duration: string;
  lessons: number;
  featured: boolean;
  instructor_id?: string | null;
};

export async function createCourse(input: CreateCourseInput): Promise<string> {
  const res = await ServerFetch<ApiEnvelope<string>>("/api/courses", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.data;
}

export default createCourse;
