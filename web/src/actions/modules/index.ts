import ServerFetch, { ApiEnvelope } from "../http";

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  position: number;
  created_at: string;
  updated_at?: string | null;
};

export async function listModules(courseId: string): Promise<Module[]> {
  const res = await ServerFetch<ApiEnvelope<Module[]>>(`/api/courses/${courseId}/modules`);
  return res.data;
}

export async function createModule(input: { course_id: string; title: string; description?: string; position: number }): Promise<string> {
  const res = await ServerFetch<ApiEnvelope<string>>(`/api/courses/${input.course_id}/modules`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function updateModule(id: string, input: Partial<{ title: string; description: string; position: number }>): Promise<Module> {
  const res = await ServerFetch<ApiEnvelope<Module>>(`/api/modules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function deleteModule(id: string): Promise<string> {
  const res = await ServerFetch<ApiEnvelope<{ id: string }>>(`/api/modules/${id}`, { method: "DELETE" });
  return res.data.id;
}
