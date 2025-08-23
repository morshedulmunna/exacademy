import ServerFetch, { ApiEnvelope } from "../http";

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  video_url?: string | null;
  duration: string;
  position: number;
  is_free: boolean;
  published: boolean;
  created_at: string;
  updated_at?: string | null;
};

export async function listLessons(moduleId: string): Promise<Lesson[]> {
  const res = await ServerFetch<ApiEnvelope<Lesson[]>>(`/api/modules/${moduleId}/lessons`);
  return res.data;
}

export async function createLesson(input: { module_id: string; title: string; description?: string; content?: string; video_url?: string; duration: string; position: number; is_free: boolean; published: boolean }): Promise<string> {
  const res = await ServerFetch<ApiEnvelope<string>>(`/api/modules/${input.module_id}/lessons`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function updateLesson(id: string, input: Partial<{ title: string; description: string; content: string; video_url: string; duration: string; position: number; is_free: boolean; published: boolean }>): Promise<Lesson> {
  const res = await ServerFetch<ApiEnvelope<Lesson>>(`/api/lessons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function deleteLesson(id: string): Promise<string> {
  const res = await ServerFetch<ApiEnvelope<{ id: string }>>(`/api/lessons/${id}`, { method: "DELETE" });
  return res.data.id;
}
