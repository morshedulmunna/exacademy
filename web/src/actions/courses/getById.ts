import ServerFetch, { ApiEnvelope } from "../http";

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  price: number;
  original_price?: number | null;
  duration: string;
  lessons: number;
  students: number;
  published: boolean;
  featured: boolean;
  view_count: number;
  instructor_id?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at?: string | null;
};

export async function getCourseById(id: string): Promise<Course> {
  const res = await ServerFetch<ApiEnvelope<Course>>(`/api/courses/${id}`);
  return res.data;
}

export default getCourseById;
