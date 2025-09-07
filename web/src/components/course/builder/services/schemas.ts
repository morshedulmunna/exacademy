import * as yup from "yup";

export const optionSchema = yup.object({
  option_text: yup.string().min(1, "Option text is required").required(),
  is_correct: yup.boolean().required(),
  position: yup.number().integer().min(1).required(),
});

export const questionSchema = yup
  .object({
    question_text: yup.string().min(1, "Question text is required").required(),
    position: yup.number().integer().min(1).required(),
    options: yup.array().of(optionSchema).min(1, "At least one option is required").required(),
  })
  .test("one-correct", "Each question must have one correct option", (q) => {
    if (!q || !q.options) return false;
    return q.options.some((o) => o.is_correct === true);
  });

export const contentSchema = yup.object({
  title: yup.string().min(1).required(),
  content_type: yup.string().min(1).required(),
  url: yup.string().min(1).required(),
  file_size: yup.number().integer().min(0).nullable().optional(),
  filename: yup.string().nullable().optional(),
  position: yup.number().integer().min(1).required(),
});

export const lessonSchema = yup.object({
  title: yup.string().min(1, "Lesson title is required").required(),
  description: yup.string().nullable().optional(),
  content: yup.string().nullable().optional(),
  video_url: yup.string().url("Video URL must be valid").nullable().optional(),
  duration: yup.string().min(1, "Duration is required").required(),
  position: yup.number().integer().min(1).required(),
  is_free: yup.boolean().required(),
  published: yup.boolean().required(),
  contents: yup.array().of(contentSchema).required(),
  questions: yup.array().of(questionSchema).required(),
  assignment: yup
    .object({
      title: yup.string().min(1, "Assignment title is required").required(),
      description: yup.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const moduleSchema = yup.object({
  course_id: yup.string().uuid("Invalid course id").required(),
  title: yup.string().min(1, "Module title is required").required(),
  description: yup.string().nullable().optional(),
  position: yup.number().integer().min(1).required(),
  lessons: yup.array().of(lessonSchema).required(),
});
