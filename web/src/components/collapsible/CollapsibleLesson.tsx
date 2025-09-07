"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, Play, Clock, FileText } from "lucide-react";
import { getLessonDetails } from "@/actions/modules/get-lesson-details-action";
import LessonDetailsForm from "@/components/collapsible/LessonDetailsForm";

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

interface LessonDetailsData {
  contents: any[];
  questions: any[];
  assignment: any;
}

interface CollapsibleLessonProps {
  lesson: Lesson;
  courseId: string;
}

/**
 * Collapsible lesson component that loads lesson details and displays form
 */
export default function CollapsibleLesson({ lesson, courseId }: CollapsibleLessonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [details, setDetails] = useState<LessonDetailsData | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load lesson details when lesson is expanded
   */
  const handleLessonToggle = async () => {
    if (!isExpanded && !details) {
      setIsLoadingDetails(true);
      setError(null);

      try {
        const result = await getLessonDetails(lesson.id);
        if (result.success) {
          setDetails(result.data);
        } else {
          setError(result.message || "Failed to load lesson details");
        }
      } catch (err) {
        setError("An error occurred while loading lesson details");
        console.error("Error loading lesson details:", err);
      } finally {
        setIsLoadingDetails(false);
      }
    }

    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4">
      {/* Lesson Header */}
      <button onClick={handleLessonToggle} className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200 flex items-center justify-between group">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {isLoadingDetails ? (
              <Loader2 className="w-4 h-4 text-gray-500 dark:text-gray-400 animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{lesson.title}</h5>
              {lesson.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{lesson.description}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{lesson.duration}</span>
          </div>
          {lesson.is_free && <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs">Free</span>}
        </div>
      </button>

      {/* Error Message */}
      {error && (
        <div className="px-3 pb-3">
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">{error}</div>
        </div>
      )}

      {/* Lesson Details Form */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {isLoadingDetails ? (
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 text-gray-500 dark:text-gray-400 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading lesson details...</p>
            </div>
          ) : (
            <div className="p-4">
              <LessonDetailsForm courseId={courseId} lessonId={lesson.id} lesson={{ id: lesson.id, title: lesson.title, description: lesson.description, duration: lesson.duration, is_free: lesson.is_free, published: lesson.published }} details={details} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
