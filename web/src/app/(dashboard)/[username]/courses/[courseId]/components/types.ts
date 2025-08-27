/**
 * Shared types for lesson-related components
 */

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: "video" | "quiz" | "assignment";
  status: "completed" | "in-progress" | "not-started";
  isLocked: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  lessons: Lesson[];
}

export interface Tab {
  id: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}
