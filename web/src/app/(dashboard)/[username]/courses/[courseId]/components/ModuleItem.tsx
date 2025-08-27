import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { LessonUtils } from "./LessonUtils";
import { Lesson, Module } from "./types";

interface ModuleItemProps {
  module: Module;
  onLessonClick: (lessonId: string) => void;
  onModuleToggle: (moduleId: string) => void;
  currentLesson?: string | null;
}

/**
 * Individual module component with expandable lessons
 */
export const ModuleItem: React.FC<ModuleItemProps> = ({ module, onLessonClick, onModuleToggle, currentLesson }) => {
  const { getCompletedLessons, getTotalModuleDuration, getProgressPercentage, formatDuration } = LessonUtils;

  return (
    <div className="mb-2">
      {/* Enhanced Module Header */}
      <button onClick={() => onModuleToggle(module.id)} className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 rounded-lg group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">{module.isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" /> : <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{module.title}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getCompletedLessons(module.lessons)}/{module.lessons.length} • {formatDuration(getTotalModuleDuration(module.lessons))}
                </p>
                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300" style={{ width: `${getProgressPercentage(module.lessons)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Enhanced Lessons List */}
      {module.isExpanded && (
        <div className="ml-6 space-y-1">
          {module.lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} onLessonClick={onLessonClick} isActive={currentLesson === lesson.id} />
          ))}
        </div>
      )}
    </div>
  );
};
