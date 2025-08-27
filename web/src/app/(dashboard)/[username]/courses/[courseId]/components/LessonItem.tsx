import React from "react";
import { Play, Lock, CheckCircle, FileText, Target } from "lucide-react";
import { Lesson } from "./types";

interface LessonItemProps {
  lesson: Lesson;
  onLessonClick: (lessonId: string) => void;
  isActive: boolean;
}

/**
 * Individual lesson component with status indicators and actions
 */
export const LessonItem: React.FC<LessonItemProps> = ({ lesson, onLessonClick, isActive }) => {
  const getStatusIcon = (status: string, isLocked: boolean) => {
    if (isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }

    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500 fill-current" />;
      case "in-progress":
        return <div className="w-4 h-4 border-2 border-blue-500 rounded-full bg-blue-500 animate-pulse"></div>;
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-3 h-3 text-gray-500 dark:text-gray-400" />;
      case "quiz":
        return <FileText className="w-3 h-3 text-gray-500 dark:text-gray-400" />;
      case "assignment":
        return <Target className="w-3 h-3 text-gray-500 dark:text-gray-400" />;
      default:
        return <Play className="w-3 h-3 text-gray-500 dark:text-gray-400" />;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}hr ${remainingMinutes}min` : `${hours}hr`;
  };

  return (
    <div
      className={`px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
        lesson.isLocked ? "opacity-60 cursor-not-allowed" : isActive ? "bg-purple-50 dark:bg-purple-900/20 border-l-2 border-purple-500" : "hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:shadow-sm"
      }`}
      onClick={() => !lesson.isLocked && onLessonClick(lesson.id)}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{getStatusIcon(lesson.status, lesson.isLocked)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {getTypeIcon(lesson.type)}
            <span className={`text-sm truncate ${lesson.isLocked ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>{lesson.title}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDuration(lesson.duration)}</span>
          {lesson.type === "video" && !lesson.isLocked && <button className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">Resources</button>}
        </div>
      </div>
    </div>
  );
};
