"use client";

import React from "react";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Play, GripVertical } from "lucide-react";
import LessonOptionalTabs from "./builder/LessonOptionalTabs";
import type { Module, Lesson } from "./builder/types";
import useCourseBuilder from "./builder/useCourseBuilder";
import { getContentIcon } from "./builder/contentIcons";

// Types moved to ./builder/types

export interface CourseBuilderProps {
  courseId?: string;
  onModulesChange?: (modules: Module[]) => void;
  className?: string;
}

/**
 * Comprehensive course builder component with drag-and-drop functionality
 */
export default function CourseBuilder({ courseId, onModulesChange, className = "" }: CourseBuilderProps) {
  const {
    modules,
    expandedModules,
    editingModule,
    setEditingModule,
    editingLesson,
    setEditingLesson,
    isLoading,
    draggedModule,
    draggedLesson,
    lessonActiveTab,
    setLessonActiveTab,
    submittingModuleId,
    toggleModuleExpansion,
    handleModuleDragStart,
    handleModuleDragEnd,
    handleModuleDragOver,
    handleModuleDragLeave,
    handleModuleDrop,
    handleLessonDragStart,
    handleLessonDragEnd,
    handleLessonDragOver,
    handleLessonDragLeave,
    handleLessonDrop,
    createModule,
    createModuleWithLesson,
    createModuleAndAllLessons,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    addContentToLesson,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addOption,
    updateOptionText,
    setCorrectOption,
    deleteOption,
    enableAssignment,
    removeAssignment,
    updateAssignmentField,
  } = useCourseBuilder({ courseId, onModulesChange });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8" role="status" aria-live="polite" aria-busy="true">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading course structure...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Structure</h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={createModuleWithLesson} className="flex font-medium items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors" aria-label="Add module with lesson" title="Create module with first lesson">
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium">Add Module + Lesson</span>
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <div
            key={module.id}
            className={`border rounded-lg bg-white dark:bg-gray-800 transition-all duration-200 ${draggedModule === module.id ? "opacity-50" : ""}`}
            draggable
            aria-grabbed={draggedModule === module.id}
            onDragStart={(e) => handleModuleDragStart(e, module.id)}
            onDragEnd={handleModuleDragEnd}
            onDragOver={handleModuleDragOver}
            onDragLeave={handleModuleDragLeave}
            onDrop={(e) => handleModuleDrop(e, module.id)}
          >
            {/* Module Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-move hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => toggleModuleExpansion(module.id)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-expanded={expandedModules.has(module.id)}
                  aria-controls={`module-${module.id}`}
                  aria-label={`${expandedModules.has(module.id) ? "Collapse" : "Expand"} module ${module.title}`}
                  title={`${expandedModules.has(module.id) ? "Collapse" : "Expand"} module`}
                >
                  {expandedModules.has(module.id) ? <ChevronDown className="w-5 h-5" aria-hidden="true" /> : <ChevronRight className="w-5 h-5" aria-hidden="true" />}
                </button>

                {editingModule === module.id ? (
                  <input
                    type="text"
                    defaultValue={module.title}
                    onBlur={(e) => updateModule(module.id, { title: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateModule(module.id, { title: e.currentTarget.value });
                        setEditingModule(null);
                      } else if (e.key === "Escape") {
                        setEditingModule(null);
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    autoFocus
                    onFocus={(e) => {
                      // Select entire title on focus for quick renaming
                      // Defer to ensure the element is focused before selection
                      requestAnimationFrame(() => {
                        try {
                          e.currentTarget.select();
                        } catch {}
                      });
                    }}
                  />
                ) : (
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{module.title}</h3>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => setEditingModule(editingModule === module.id ? null : module.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Edit module title" title="Edit title">
                  <Edit className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Delete this module and all its lessons? This action cannot be undone.")) {
                      deleteModule(module.id);
                    }
                  }}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                  aria-label="Delete module"
                  title="Delete module"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => createModuleAndAllLessons(module.id)}
                  className={`
                    px-2 py-1 flex text-sm justify-center items-center gap-2
                    rounded-md border border-green-500
                    bg-green-600 text-white
                    shadow-sm transition
                    hover:bg-green-500 hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-green-500
                    disabled:bg-gray-300 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed
                    dark:bg-green-600 dark:text-white dark:border-green-500
                    dark:hover:bg-green-700
                  `}
                  aria-label="Create module with all lessons"
                  title="Create module + all lessons"
                  disabled={submittingModuleId === module.id}
                  aria-busy={submittingModuleId === module.id}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium">Create Module</span>
                </button>
              </div>
            </div>

            {/* Module Content */}
            {expandedModules.has(module.id) && (
              <div id={`module-${module.id}`} className="p-4 space-y-4">
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
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => createLesson(module.id)} className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors" aria-label="Add lesson">
                        <Plus className="w-3 h-3" aria-hidden="true" />
                        <span>Add Lesson</span>
                      </button>
                      {/* Submit Lessons button removed as per request */}
                    </div>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className={`border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 transition-all duration-200 ${draggedLesson?.lessonId === lesson.id ? "opacity-50" : ""}`}
                      draggable
                      aria-grabbed={draggedLesson?.lessonId === lesson.id}
                      onDragStart={(e) => handleLessonDragStart(e, module.id, lesson.id)}
                      onDragEnd={handleLessonDragEnd}
                      onDragOver={handleLessonDragOver}
                      onDragLeave={handleLessonDragLeave}
                      onDrop={(e) => handleLessonDrop(e, module.id, lesson.id)}
                    >
                      {/* Lesson Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-move hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-hidden="true" />
                          <Play className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                          {editingLesson === lesson.id ? (
                            <input
                              type="text"
                              defaultValue={lesson.title}
                              onBlur={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  updateLesson(module.id, lesson.id, { title: e.currentTarget.value });
                                  setEditingLesson(null);
                                } else if (e.key === "Escape") {
                                  setEditingLesson(null);
                                }
                              }}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              autoFocus
                            />
                          ) : (
                            <h5 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h5>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button type="button" onClick={() => setEditingLesson(editingLesson === lesson.id ? null : lesson.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Edit lesson title" title="Edit title">
                            <Edit className="w-3 h-3" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Delete this lesson? This action cannot be undone.")) {
                                deleteLesson(module.id, lesson.id);
                              }
                            }}
                            className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                            aria-label="Delete lesson"
                            title="Delete lesson"
                          >
                            <Trash2 className="w-3 h-3" aria-hidden="true" />
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
                              defaultValue={lesson.video_url || ""}
                              onBlur={(e) => updateLesson(module.id, lesson.id, { video_url: e.target.value })}
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
                                  checked={lesson.is_free}
                                  onChange={(e) => updateLesson(module.id, lesson.id, { is_free: e.target.checked })}
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

                      {/* Optional Sections Tabs */}
                      <div className="mt-6 space-y-3">
                        {(() => {
                          const tabs: Array<{ key: "resources" | "questions" | "assignment"; label: string; count?: number }> = [];
                          const resourcesCount = lesson.contents?.length ?? 0;
                          const questionsCount = lesson.questions?.length ?? 0;
                          const hasAssignment = !!lesson.assignment;
                          if (resourcesCount > 0 || lessonActiveTab[lesson.id] === "resources") tabs.push({ key: "resources", label: `Resources${resourcesCount ? ` (${resourcesCount})` : ""}` });
                          if (questionsCount > 0) tabs.push({ key: "questions", label: `Questions${questionsCount ? ` (${questionsCount})` : ""}` });
                          if (hasAssignment) tabs.push({ key: "assignment", label: "Assignment" });

                          if (tabs.length === 0) {
                            return (
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Add optional content to this lesson:</p>
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={() => setLessonActiveTab((p) => ({ ...p, [lesson.id]: "resources" }))} className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600" aria-label="Add resources">
                                    Add Resources
                                  </button>
                                  <button type="button" onClick={() => addQuestion(module.id, lesson.id)} className="px-2 py-1 text-xs rounded bg-blue-600 text-white" aria-label="Add question">
                                    Add Question
                                  </button>
                                  <button type="button" onClick={() => enableAssignment(module.id, lesson.id)} className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600" aria-label="Add assignment">
                                    Add Assignment
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          const active = lessonActiveTab[lesson.id] ?? tabs[0]?.key ?? null;

                          return (
                            <LessonOptionalTabs
                              courseId={courseId}
                              moduleId={module.id}
                              lesson={lesson}
                              activeTab={active}
                              onChangeActiveTab={(lessonId, tab) => setLessonActiveTab((p) => ({ ...p, [lessonId]: tab }))}
                              addContentToLesson={addContentToLesson}
                              addQuestion={addQuestion}
                              updateQuestion={updateQuestion}
                              deleteQuestion={deleteQuestion}
                              addOption={addOption}
                              updateOptionText={updateOptionText}
                              setCorrectOption={setCorrectOption}
                              deleteOption={deleteOption}
                              enableAssignment={enableAssignment}
                              removeAssignment={removeAssignment}
                              updateAssignmentField={updateAssignmentField}
                              getContentIcon={getContentIcon}
                            />
                          );
                        })()}
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
