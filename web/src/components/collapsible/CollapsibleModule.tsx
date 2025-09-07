"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { listLessonsByModule } from "@/actions/modules/list-lessons-action";
import CollapsibleLesson from "./CollapsibleLesson";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
  position: number;
  is_free: boolean;
  published: boolean;
  created_at: string;
  updated_at?: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  position: number;
  created_at: string;
  updated_at?: string;
}

interface CollapsibleModuleProps {
  module: Module;
  courseId: string;
}

/**
 * Collapsible module component that loads lessons on demand
 */
export default function CollapsibleModule({ module, courseId }: CollapsibleModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load lessons when module is expanded
   */
  const handleModuleToggle = async () => {
    if (!isExpanded && lessons.length === 0) {
      setIsLoadingLessons(true);
      setError(null);

      try {
        const result = await listLessonsByModule(module.id);
        if (result.success) {
          setLessons(result.data);
        } else {
          setError(result.message || "Failed to load lessons");
        }
      } catch (err) {
        setError("An error occurred while loading lessons");
        console.error("Error loading lessons:", err);
      } finally {
        setIsLoadingLessons(false);
      }
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
      {/* Module Header */}
      <button onClick={handleModuleToggle} className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 rounded-lg group flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {isLoadingLessons ? (
              <Loader2 className="w-4 h-4 text-gray-500 dark:text-gray-400 animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{module.title}</h4>
            {module.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{module.description}</p>}
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{lessons.length > 0 && `${lessons.length} lesson${lessons.length !== 1 ? "s" : ""}`}</div>
      </button>

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-4">
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>
        </div>
      )}

      {/* Lessons List */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {isLoadingLessons ? (
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading lessons...</p>
            </div>
          ) : lessons.length > 0 ? (
            <div className="space-y-1">
              {lessons
                .sort((a, b) => a.position - b.position)
                .map((lesson) => (
                  <CollapsibleLesson key={lesson.id} lesson={lesson} courseId={courseId} />
                ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No lessons available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
