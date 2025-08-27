import React from "react";
import { ChevronDown, ChevronRight, Play, Lock, CheckCircle, Clock, FileText, MessageSquare, Star, Share, MoreVertical } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: "video" | "quiz" | "assignment";
  status: "completed" | "in-progress" | "not-started";
  isLocked: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  lessons: Lesson[];
}

interface LessonsListProps {
  modules: Module[];
  onLessonClick: (lessonId: string) => void;
  onModuleToggle: (moduleId: string) => void;
}

/**
 * Lessons list component matching Udemy course content design
 */
export const LessonsList: React.FC<LessonsListProps> = ({ modules, onLessonClick, onModuleToggle }) => {
  const getStatusIcon = (status: string, isLocked: boolean) => {
    if (isLocked) {
      return <Lock className="w-4 h-4 text-gray-400" />;
    }

    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500 fill-current" />;
      case "in-progress":
        return <div className="w-4 h-4 border-2 border-blue-500 rounded-full bg-blue-500"></div>;
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
        return <FileText className="w-3 h-3 text-gray-500 dark:text-gray-400" />;
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

  const getTotalModuleDuration = (lessons: Lesson[]) => {
    return lessons.reduce((total, lesson) => total + lesson.duration, 0);
  };

  const getCompletedLessons = (lessons: Lesson[]) => {
    return lessons.filter((lesson) => lesson.status === "completed").length;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Main Content Area - Video Player and Tabs */}
      <div className="xl:col-span-3 space-y-6">
        {/* Video Player */}
        <div className="bg-gray-900 dark:bg-black rounded-lg aspect-video flex items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black"></div>
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300 cursor-pointer group">
              <Play className="w-12 h-12 text-white ml-1 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">DevOps Beginners to Advanced</h2>
            <p className="text-gray-300 text-lg">Click to start learning</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {["Overview", "Q&A", "Notes", "Announcements", "Reviews", "Learning tools"].map((tab, index) => (
                <button
                  key={tab}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    index === 0 ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Course Description</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">Begin Your DevOps Career As a Newbie | AWS, Linux, Scripting, Jenkins, Ansible, GitOps, Docker, Kubernetes, & Terraform.</p>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">4.6</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">from 41,018 ratings</p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">241,805</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">56 hours</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Course Content */}
      <div className="xl:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 sticky top-24 shadow-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course content</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {modules.reduce((total, module) => total + module.lessons.length, 0)} lectures • {formatDuration(modules.reduce((total, module) => total + getTotalModuleDuration(module.lessons), 0))}
            </p>
          </div>

          {/* Course Content List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {modules.map((module) => (
              <div key={module.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                {/* Module Header */}
                <button onClick={() => onModuleToggle(module.id)} className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {module.isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" /> : <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200" />}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{module.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {getCompletedLessons(module.lessons)}/{module.lessons.length} • {formatDuration(getTotalModuleDuration(module.lessons))}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Lessons List */}
                {module.isExpanded && (
                  <div className="bg-gray-50 dark:bg-gray-900/50">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer" onClick={() => !lesson.isLocked && onLessonClick(lesson.id)}>
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(lesson.status, lesson.isLocked)}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(lesson.type)}
                              <span className={`text-sm truncate ${lesson.isLocked ? "text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>{lesson.title}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDuration(lesson.duration)}</span>
                            {lesson.type === "video" && <button className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors">Resources</button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
