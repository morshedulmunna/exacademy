"use client";

import React from "react";
import { Edit, Trash2, Play, GripVertical } from "lucide-react";
import type { Lesson } from "../types";
import LessonOptionalTabs from "../LessonOptionalTabs";

export interface LessonCardProps {
  courseId?: string;
  moduleId: string;
  lesson: Lesson;
  isDragging: boolean;
  editingLessonId: string | null;
  setEditingLesson: (id: string | null) => void;
  // DnD handlers
  handleLessonDragStart: (e: React.DragEvent, moduleId: string, lessonId: string) => void;
  handleLessonDragEnd: (e: React.DragEvent) => void;
  handleLessonDragOver: (e: React.DragEvent) => void;
  handleLessonDragLeave: (e: React.DragEvent) => void;
  handleLessonDrop: (e: React.DragEvent, targetModuleId: string, targetLessonId: string) => void;
  // CRUD
  updateLesson: (moduleId: string, lessonId: string, data: Partial<Lesson>) => void;
  openDeleteLessonModal: (moduleId: string, lessonId: string) => void;
  // Tabs state and actions
  lessonActiveTab: Record<string, "resources" | "questions" | "assignment" | null>;
  setLessonActiveTab: React.Dispatch<React.SetStateAction<Record<string, "resources" | "questions" | "assignment" | null>>>;
  // Optional content handlers
  addContentToLesson: (moduleId: string, lessonId: string, result: any) => void;
  addQuestion: (moduleId: string, lessonId: string) => void;
  updateQuestion: (moduleId: string, lessonId: string, questionId: string, text: string) => void;
  deleteQuestion: (moduleId: string, lessonId: string, questionId: string) => void;
  addOption: (moduleId: string, lessonId: string, questionId: string) => void;
  updateOptionText: (moduleId: string, lessonId: string, questionId: string, optionId: string, text: string) => void;
  setCorrectOption: (moduleId: string, lessonId: string, questionId: string, optionId: string) => void;
  deleteOption: (moduleId: string, lessonId: string, questionId: string, optionId: string) => void;
  enableAssignment: (moduleId: string, lessonId: string) => void;
  removeAssignment: (moduleId: string, lessonId: string) => void;
  updateAssignmentField: (moduleId: string, lessonId: string, field: "title" | "description", value: string) => void;
  getContentIcon: (type: string) => React.ReactNode;
}

export default function LessonCard({
  courseId,
  moduleId,
  lesson,
  isDragging,
  editingLessonId,
  setEditingLesson,
  handleLessonDragStart,
  handleLessonDragEnd,
  handleLessonDragOver,
  handleLessonDragLeave,
  handleLessonDrop,
  updateLesson,
  openDeleteLessonModal,
  lessonActiveTab,
  setLessonActiveTab,
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
  getContentIcon,
}: LessonCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 transition-all duration-200 ${isDragging ? "opacity-50" : ""}`}
      draggable
      aria-grabbed={isDragging}
      onDragStart={(e) => handleLessonDragStart(e, moduleId, lesson.id)}
      onDragEnd={handleLessonDragEnd}
      onDragOver={handleLessonDragOver}
      onDragLeave={handleLessonDragLeave}
      onDrop={(e) => handleLessonDrop(e, moduleId, lesson.id)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-move hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-hidden="true" />
          <Play className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          {editingLessonId === lesson.id ? (
            <input
              type="text"
              defaultValue={lesson.title}
              onBlur={(e) => updateLesson(moduleId, lesson.id, { title: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateLesson(moduleId, lesson.id, { title: e.currentTarget.value });
                  setEditingLesson(null);
                } else if (e.key === "Escape") {
                  setEditingLesson(null);
                }
              }}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
              onFocus={(e) => {
                requestAnimationFrame(() => {
                  try {
                    e.currentTarget.select();
                  } catch {}
                });
              }}
            />
          ) : (
            <h5
              className="font-medium text-gray-900 dark:text-white cursor-text"
              onClick={() => setEditingLesson(lesson.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setEditingLesson(lesson.id);
              }}
              title="Click to rename lesson"
            >
              {lesson.title}
            </h5>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button type="button" onClick={() => setEditingLesson(editingLessonId === lesson.id ? null : lesson.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Edit lesson title" title="Edit title">
            <Edit className="w-3 h-3" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => openDeleteLessonModal(moduleId, lesson.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete lesson" title="Delete lesson">
            <Trash2 className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            defaultValue={lesson.description || ""}
            onBlur={(e) => updateLesson(moduleId, lesson.id, { description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows={7}
            placeholder="Enter lesson description..."
          />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" name={`video_source_${lesson.id}`} checked={(lesson.video_source ?? "url") === "url"} onChange={() => updateLesson(moduleId, lesson.id, { video_source: "url", video_file: null })} className="text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Use Video URL</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name={`video_source_${lesson.id}`} checked={(lesson.video_source ?? "url") === "file"} onChange={() => updateLesson(moduleId, lesson.id, { video_source: "file" })} className="text-blue-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Upload Video File</span>
            </label>
          </div>

          {(lesson.video_source ?? "url") === "url" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL</label>
              <input
                type="url"
                defaultValue={lesson.video_url || ""}
                onBlur={(e) => updateLesson(moduleId, lesson.id, { video_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://..."
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                  updateLesson(moduleId, lesson.id, { video_file: file });
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {lesson.video_file ? (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Selected: {lesson.video_file.name} ({Math.round(lesson.video_file.size / 1024)} KB)
                </p>
              ) : null}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
              <input
                type="text"
                defaultValue={lesson.duration}
                onBlur={(e) => updateLesson(moduleId, lesson.id, { duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="5m"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={lesson.is_free} onChange={(e) => updateLesson(moduleId, lesson.id, { is_free: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Free</span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={lesson.published} onChange={(e) => updateLesson(moduleId, lesson.id, { published: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Published</span>
              </label>
            </div>
          </div>
        </div>
      </div>

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
                  <button type="button" onClick={() => addQuestion(moduleId, lesson.id)} className="px-2 py-1 text-xs rounded bg-blue-600 text-white" aria-label="Add question">
                    Add Question
                  </button>
                  <button type="button" onClick={() => enableAssignment(moduleId, lesson.id)} className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600" aria-label="Add assignment">
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
              moduleId={moduleId}
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
  );
}
