import type { Module } from "../types";

/**
 * Transform backend deep module response into frontend Module[] shape.
 */
export function transformDeepModulesResponse(response: any): Module[] {
  if (!response?.data?.data) return [];
  const source = response.data.data;
  const modules: Module[] = source.map((moduleDeep: any) => ({
    id: moduleDeep.module.id,
    title: moduleDeep.module.title,
    description: moduleDeep.module.description,
    position: moduleDeep.module.position,
    lessons: moduleDeep.lessons.map((lessonDeep: any) => ({
      id: lessonDeep.lesson.id,
      title: lessonDeep.lesson.title,
      description: lessonDeep.lesson.description,
      content: lessonDeep.lesson.content,
      video_url: lessonDeep.lesson.video_url,
      duration: lessonDeep.lesson.duration,
      position: lessonDeep.lesson.position,
      is_free: lessonDeep.lesson.is_free,
      published: lessonDeep.lesson.published,
      contents:
        lessonDeep.contents?.map((content: any) => ({
          id: content.id,
          title: content.title,
          type: content.content_type,
          url: content.url,
          size: content.file_size,
          filename: content.filename,
        })) || [],
      questions:
        lessonDeep.questions?.map((questionWithOptions: any) => ({
          id: questionWithOptions.question.id,
          text: questionWithOptions.question.question_text,
          options: questionWithOptions.options.map((option: any) => ({
            id: option.id,
            text: option.option_text,
            is_correct: option.is_correct,
          })),
        })) || [],
      assignment: lessonDeep.assignment
        ? {
            id: lessonDeep.assignment.lesson_id,
            title: lessonDeep.assignment.title,
            description: lessonDeep.assignment.description,
          }
        : null,
    })),
  }));
  return modules;
}
