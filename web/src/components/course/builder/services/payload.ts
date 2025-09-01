import type { Lesson, Module } from "../types";

/** Build snake_case payload for creating a module with lessons */
export function buildCreateModulePayload(courseId: string, module: Module) {
  const validLessons = (module.lessons ?? []).filter((l) => {
    if (!l || !l.id || !l.title || typeof l.title !== "string" || l.title.trim().length === 0) return false;
    // Skip File objects or non-serializable data
    if (l.video_file && typeof File !== "undefined" && l.video_file instanceof File) return false;
    return true;
  });

  const payload = {
    course_id: courseId,
    title: module.title,
    description: module.description ?? "",
    position: module.position,
    lessons: validLessons.map((l, lessonIndex) => buildLessonPayload(l, lessonIndex)),
  } as const;
  return payload;
}

export function buildLessonPayload(lesson: Lesson, lessonIndex = 0) {
  return {
    title: lesson.title,
    description: lesson.description ?? null,
    content: lesson.content ?? null,
    video_url: lesson.video_url ?? null,
    duration: lesson.duration || "0m",
    position: lesson.position ?? lessonIndex + 1,
    is_free: !!lesson.is_free,
    published: !!lesson.published,
    contents: (lesson.contents ?? []).map((c, contentIndex) => ({
      title: c.title,
      content_type: c.type,
      url: c.url,
      file_size: c.size ?? undefined,
      filename: c.filename,
      position: contentIndex + 1,
    })),
    questions: (lesson.questions ?? []).map((q, qIndex) => ({
      question_text: q.text,
      position: qIndex + 1,
      options: (q.options ?? []).map((o, oIndex) => ({
        option_text: o.text,
        is_correct: !!o.is_correct,
        position: oIndex + 1,
      })),
    })),
    assignment: lesson.assignment
      ? {
          title: lesson.assignment.title,
          description: lesson.assignment.description ?? "",
        }
      : null,
  } as const;
}

/** Deep sanitize payload to ensure safe JSON serialization */
export function sanitizePayload<T>(payload: T): T {
  try {
    const cleaned = JSON.parse(JSON.stringify(payload, (_key, value) => (value === undefined ? null : value)));
    return cleaned as T;
  } catch (_err) {
    // On failure, return minimal object shape
    return payload;
  }
}
