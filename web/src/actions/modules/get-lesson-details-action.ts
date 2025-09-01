"use server";

import API from "@/configs/api.config";
import { DataObj } from "@/lib/utils";

/**
 * Fetch lesson related details: contents, questions, and assignment
 * Note: There is no GET /api/lessons/:id handler; lesson basics should come from context
 * @param lessonId - The ID of the lesson
 */
export async function getLessonDetails(lessonId: string): Promise<any> {
  try {
    // Fetch lesson contents
    const contentsRes = await API.get(`/api/lessons/${lessonId}/contents`);
    // Fetch lesson questions
    const questionsRes = await API.get(`/api/lessons/${lessonId}/questions`);
    // Fetch lesson assignment
    const assignmentRes = await API.get(`/api/lessons/${lessonId}/assignment`);

    const contents = DataObj(contentsRes).data;
    const questions = DataObj(questionsRes).data;
    const assignment = DataObj(assignmentRes).data;

    return {
      success: true,
      data: {
        contents,
        questions,
        assignment,
      },
    } as const;
  } catch (error: any) {
    console.error("Error fetching lesson details:", error);
    const message: string = error?.response?.data?.message || error?.message || "Failed to fetch lesson details";
    return { success: false, message } as const;
  }
}
