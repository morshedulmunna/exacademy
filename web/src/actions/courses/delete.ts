import ServerFetch, { ApiEnvelope } from "../http";

export async function deleteCourse(id: string): Promise<string> {
  const res = await ServerFetch<ApiEnvelope<{ id: string }>>(`/api/courses/${id}`, {
    method: "DELETE",
  });
  return res.data.id;
}

export default deleteCourse;
