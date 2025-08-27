import React from "react";
import { Play, CheckCircle, Lock, Clock, FileText } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: "video" | "text" | "quiz";
  status: "not-started" | "in-progress" | "completed";
  isLocked: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface LessonsListProps {
  modules: Module[];
  onLessonClick: (lessonId: string) => void;
  onModuleToggle: (moduleId: string) => void;
}

/**
 * Lessons list component for course detail page
 */
export const LessonsList: React.FC<LessonsListProps> = ({ 
  modules, 
  onLessonClick, 
  onModuleToggle 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Content</h2>
    
    <div className="space-y-4">
      {modules.map((module) => (
        <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <button
            onClick={() => onModuleToggle(module.id)}
            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{module.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {module.lessons.filter(l => l.status === "completed").length}/{module.lessons.length} lessons
              </span>
              <svg 
                className={`w-5 h-5 text-gray-400 transform transition-transform ${module.isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {module.isExpanded && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <button
                    onClick={() => !lesson.isLocked && onLessonClick(lesson.id)}
                    disabled={lesson.isLocked}
                    className={`w-full flex items-center justify-between text-left ${
                      lesson.isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center">
                        {lesson.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : lesson.isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : lesson.type === "video" ? (
                          <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : lesson.type === "quiz" ? (
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.duration} min</span>
                          <span>•</span>
                          <span className="capitalize">{lesson.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    {!lesson.isLocked && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        lesson.status === "completed" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : lesson.status === "in-progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                        {lesson.status === "completed" ? "Completed" : lesson.status === "in-progress" ? "In Progress" : "Not Started"}
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
