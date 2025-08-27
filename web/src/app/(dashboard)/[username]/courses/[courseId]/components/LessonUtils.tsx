import { Lesson } from "./types";

/**
 * Utility functions for lesson-related calculations and formatting
 */
export const LessonUtils = {
  /**
   * Format duration from minutes to human-readable format
   */
  formatDuration: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}hr ${remainingMinutes}min` : `${hours}hr`;
  },

  /**
   * Get total duration of lessons in a module
   */
  getTotalModuleDuration: (lessons: Lesson[]): number => {
    return lessons.reduce((total, lesson) => total + lesson.duration, 0);
  },

  /**
   * Get number of completed lessons
   */
  getCompletedLessons: (lessons: Lesson[]): number => {
    return lessons.filter((lesson) => lesson.status === "completed").length;
  },

  /**
   * Calculate progress percentage for lessons
   */
  getProgressPercentage: (lessons: Lesson[]): number => {
    const completed = lessons.filter((lesson) => lesson.status === "completed").length;
    return lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
  },

  /**
   * Get status icon based on lesson status and lock state
   */
  getStatusIcon: (status: string, isLocked: boolean) => {
    if (isLocked) {
      return "locked";
    }

    switch (status) {
      case "completed":
        return "completed";
      case "in-progress":
        return "in-progress";
      default:
        return "not-started";
    }
  },

  /**
   * Get type icon based on lesson type
   */
  getTypeIcon: (type: string) => {
    switch (type) {
      case "video":
        return "video";
      case "quiz":
        return "quiz";
      case "assignment":
        return "assignment";
      default:
        return "video";
    }
  },
};
