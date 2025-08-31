export interface LessonContent {
  id: string;
  title: string;
  type: string;
  url: string;
  size?: number;
  filename: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  duration: string;
  position: number;
  is_free: boolean;
  published: boolean;
  contents?: LessonContent[];
  questions?: Question[];
  assignment?: Assignment | null;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  position: number;
  lessons: Lesson[];
}
