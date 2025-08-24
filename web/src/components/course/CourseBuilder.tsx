"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronDown, ChevronRight, Upload, FileText, Video, Play, GripVertical } from "lucide-react";
import CourseContentUpload from "@/components/ui/CourseContentUpload";
import { FileUploadResult } from "@/hooks/useCourseContentUpload";
// Backend removed; operate purely on local state

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration: string;
  order: number;
  isFree: boolean;
  published: boolean;
  contents?: LessonContent[];
}

export interface LessonContent {
  id: string;
  title: string;
  type: string;
  url: string;
  size?: number;
  filename: string;
}

export interface CourseBuilderProps {
  courseId: string;
  onModulesChange?: (modules: Module[]) => void;
  className?: string;
}

/**
 * Comprehensive course builder component with drag-and-drop functionality
 */
export default function CourseBuilder({ courseId, onModulesChange, className = "" }: CourseBuilderProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [draggedLesson, setDraggedLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);

  // Load modules on component mount
  useEffect(() => {
    loadModules();
  }, [courseId]);

  const loadModules = async () => {
    setIsLoading(true);
    const initial: Module[] = [];
    setModules(initial);
    onModulesChange?.(initial);
    setIsLoading(false);
  };

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Drag and Drop Handlers for Modules
  const handleModuleDragStart = (e: React.DragEvent, moduleId: string) => {
    setDraggedModule(moduleId);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50", "scale-95");
  };

  const handleModuleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50", "scale-95");
    setDraggedModule(null);
  };

  const handleModuleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("border-blue-400", "bg-blue-50", "dark:bg-blue-900/20");
  };

  const handleModuleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50", "dark:bg-blue-900/20");
  };

  const handleModuleDrop = async (e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50", "dark:bg-blue-900/20");

    if (!draggedModule || draggedModule === targetModuleId) return;

    const draggedIndex = modules.findIndex((m) => m.id === draggedModule);
    const targetIndex = modules.findIndex((m) => m.id === targetModuleId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newModules = [...modules];
    const [draggedModuleData] = newModules.splice(draggedIndex, 1);
    newModules.splice(targetIndex, 0, draggedModuleData);

    // Update order for all modules
    const updatedModules = newModules.map((module, index) => ({
      ...module,
      order: index + 1,
    }));

    setModules(updatedModules);
    setDraggedModule(null);

    // Update orders in database
    // Backend removed: local-only reorder
  };

  // Drag and Drop Handlers for Lessons
  const handleLessonDragStart = (e: React.DragEvent, moduleId: string, lessonId: string) => {
    setDraggedLesson({ moduleId, lessonId });
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50", "scale-95");
  };

  const handleLessonDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("opacity-50", "scale-95");
    setDraggedLesson(null);
  };

  const handleLessonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    e.currentTarget.classList.add("border-green-400", "bg-green-50", "dark:bg-green-900/20");
  };

  const handleLessonDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-green-400", "bg-green-50", "dark:bg-green-900/20");
  };

  const handleLessonDrop = async (e: React.DragEvent, targetModuleId: string, targetLessonId: string) => {
    e.preventDefault();
    if (!draggedLesson) return;

    const { moduleId: sourceModuleId, lessonId: sourceLessonId } = draggedLesson;
    if (sourceLessonId === targetLessonId) return;

    const sourceModule = modules.find((m) => m.id === sourceModuleId);
    const targetModule = modules.find((m) => m.id === targetModuleId);

    if (!sourceModule || !targetModule) return;

    const sourceLessonIndex = sourceModule.lessons.findIndex((l) => l.id === sourceLessonId);
    const targetLessonIndex = targetModule.lessons.findIndex((l) => l.id === targetLessonId);

    if (sourceLessonIndex === -1 || targetLessonIndex === -1) return;

    // Only support reorder within same module for now
    if (sourceModuleId !== targetModuleId) return;

    const newModules = [...modules];
    const sourceModuleIndex = newModules.findIndex((m) => m.id === sourceModuleId);

    // Remove lesson from source module
    const [movedLesson] = newModules[sourceModuleIndex].lessons.splice(sourceLessonIndex, 1);

    // Add lesson back in new position
    newModules[sourceModuleIndex].lessons.splice(targetLessonIndex, 0, movedLesson);

    // Update order for lessons in the module
    newModules[sourceModuleIndex].lessons = newModules[sourceModuleIndex].lessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1,
    }));

    setModules(newModules);
    setDraggedLesson(null);

    // Backend removed: local-only reorder (no API call)
  };

  const createModule = async () => {
    try {
      const id = crypto.randomUUID();
      const newModule: Module = { id, title: "New Module", description: "", order: modules.length + 1, lessons: [] };
      const next = [...modules, newModule];
      setModules(next);
      setExpandedModules((prev) => new Set([...prev, newModule.id]));
      onModulesChange?.(next);
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  const updateModule = async (moduleId: string, data: Partial<Module>) => {
    try {
      const next = modules.map((m) => (m.id === moduleId ? { ...m, ...data } : m));
      setModules(next);
      onModulesChange?.(next);
      setEditingModule(null);
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module? This will also delete all lessons within it.")) {
      return;
    }

    try {
      const next = modules.filter((m) => m.id !== moduleId);
      setModules(next);
      onModulesChange?.(next);
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const createLesson = async (moduleId: string) => {
    try {
      const module = modules.find((m) => m.id === moduleId);
      const lessonOrder = module ? module.lessons.length + 1 : 1;
      const id = crypto.randomUUID();
      const newLesson: Lesson = { id, title: "New Lesson", description: "", content: "", videoUrl: "", duration: "0m", order: lessonOrder, isFree: false, published: false, contents: [] };
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m));
      setModules(next);
      onModulesChange?.(next);
      setEditingLesson(newLesson.id);
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  const updateLesson = async (moduleId: string, lessonId: string, data: Partial<Lesson>) => {
    try {
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...data } : l)) } : m));
      setModules(next);
      onModulesChange?.(next);
      setEditingLesson(null);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const deleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      const next = modules.map((m) => (m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m));
      setModules(next);
      onModulesChange?.(next);
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const addContentToLesson = async (moduleId: string, lessonId: string, fileResult: FileUploadResult) => {
    try {
      const newContent = {
        id: crypto.randomUUID(),
        title: fileResult.originalName,
        type: fileResult.type,
        url: fileResult.url,
        size: fileResult.size,
        filename: fileResult.filename,
      } as LessonContent;
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, contents: [...(l.contents ?? []), newContent] } : l)),
              }
            : m
        )
      );
      onModulesChange?.(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, contents: [...(l.contents ?? []), newContent] } : l)),
              }
            : m
        )
      );
    } catch (error) {
      console.error("Error adding content to lesson:", error);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <Video className="w-4 h-4 text-red-500" />;
      case "PDF":
      case "DOCUMENT":
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading course structure...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Structure</h2>
        <button onClick={createModule} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Module</span>
        </button>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <div
            key={module.id}
            className={`border rounded-lg bg-white dark:bg-gray-800 transition-all duration-200 ${draggedModule === module.id ? "opacity-50" : ""}`}
            draggable
            onDragStart={(e) => handleModuleDragStart(e, module.id)}
            onDragEnd={handleModuleDragEnd}
            onDragOver={handleModuleDragOver}
            onDragLeave={handleModuleDragLeave}
            onDrop={(e) => handleModuleDrop(e, module.id)}
          >
            {/* Module Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-move hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                <button onClick={() => toggleModuleExpansion(module.id)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  {expandedModules.has(module.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                {editingModule === module.id ? (
                  <input
                    type="text"
                    defaultValue={module.title}
                    onBlur={(e) => updateModule(module.id, { title: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && updateModule(module.id, { title: e.currentTarget.value })}
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    autoFocus
                  />
                ) : (
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{module.title}</h3>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={() => setEditingModule(editingModule === module.id ? null : module.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteModule(module.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Module Content */}
            {expandedModules.has(module.id) && (
              <div className="p-4 space-y-4">
                {/* Module Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Module Description</label>
                  <textarea
                    defaultValue={module.description || ""}
                    onBlur={(e) => updateModule(module.id, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={2}
                    placeholder="Enter module description..."
                  />
                </div>

                {/* Lessons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Lessons</h4>
                    <button onClick={() => createLesson(module.id)} className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors">
                      <Plus className="w-3 h-3" />
                      <span>Add Lesson</span>
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className={`border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 transition-all duration-200 ${draggedLesson?.lessonId === lesson.id ? "opacity-50" : ""}`}
                      draggable
                      onDragStart={(e) => handleLessonDragStart(e, module.id, lesson.id)}
                      onDragEnd={handleLessonDragEnd}
                      onDragOver={handleLessonDragOver}
                      onDragLeave={handleLessonDragLeave}
                      onDrop={(e) => handleLessonDrop(e, module.id, lesson.id)}
                    >
                      {/* Lesson Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-move hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                          <Play className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          {editingLesson === lesson.id ? (
                            <input
                              type="text"
                              defaultValue={lesson.title}
                              onBlur={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                              onKeyPress={(e) => e.key === "Enter" && updateLesson(module.id, lesson.id, { title: e.currentTarget.value })}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              autoFocus
                            />
                          ) : (
                            <h5 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h5>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button onClick={() => setEditingLesson(editingLesson === lesson.id ? null : lesson.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteLesson(module.id, lesson.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Lesson Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                          <textarea
                            defaultValue={lesson.description || ""}
                            onBlur={(e) => updateLesson(module.id, lesson.id, { description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows={2}
                            placeholder="Enter lesson description..."
                          />
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL</label>
                            <input
                              type="url"
                              defaultValue={lesson.videoUrl || ""}
                              onBlur={(e) => updateLesson(module.id, lesson.id, { videoUrl: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="https://..."
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                              <input
                                type="text"
                                defaultValue={lesson.duration}
                                onBlur={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder="5m"
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={lesson.isFree}
                                  onChange={(e) => updateLesson(module.id, lesson.id, { isFree: e.target.checked })}
                                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Free</span>
                              </label>

                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={lesson.published}
                                  onChange={(e) => updateLesson(module.id, lesson.id, { published: e.target.checked })}
                                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Published</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lesson Content */}
                      <div className="space-y-3">
                        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Files</h6>

                        {/* Existing Content */}
                        {(lesson.contents?.length ?? 0) > 0 && (
                          <div className="space-y-2">
                            {(lesson.contents ?? []).map((content) => (
                              <div key={content.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">
                                <div className="flex items-center space-x-2">
                                  {getContentIcon(content.type)}
                                  <span className="text-sm text-gray-900 dark:text-white">{content.title}</span>
                                </div>
                                <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Content Upload */}
                        <CourseContentUpload
                          courseId={courseId}
                          lessonId={lesson.id}
                          onFileUploaded={(result) => addContentToLesson(module.id, lesson.id, result)}
                          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4"
                          placeholder="Upload lesson content..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No modules created yet. Click "Add Module" to get started.</p>
        </div>
      )}
    </div>
  );
}
