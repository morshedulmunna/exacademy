"use client";

import React from "react";
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import type { Module, Lesson } from "../types";
import LessonCard from "./LessonCard";

export interface ModuleCardProps {
  courseId?: string;
  module: Module;
  isExpanded: boolean;
  isDragging: boolean;
  submittingModuleId: string | null;
  // Module DnD
  handleModuleDragStart: (e: React.DragEvent, moduleId: string) => void;
  handleModuleDragEnd: (e: React.DragEvent) => void;
  handleModuleDragOver: (e: React.DragEvent) => void;
  handleModuleDragLeave: (e: React.DragEvent) => void;
  handleModuleDrop: (e: React.DragEvent, targetModuleId: string) => void;
  // Expansion
  toggleModuleExpansion: (moduleId: string) => void;
  // Lesson expansion
  expandedLessons: Set<string>;
  toggleLessonExpansion: (lessonId: string) => void;
  // Module edit state/actions
  editingModuleId: string | null;
  setEditingModule: (id: string | null) => void;
  updateModule: (moduleId: string, data: Partial<Module>) => void;
  openDeleteModuleModal: (moduleId: string) => void;
  createModuleAndAllLessons: (moduleId: string) => void;
  // Lesson actions/state
  createLesson: (moduleId: string) => void;
  draggedLesson: { moduleId: string; lessonId: string } | null;
  editingLessonId: string | null;
  setEditingLesson: (id: string | null) => void;
  handleLessonDragStart: (e: React.DragEvent, moduleId: string, lessonId: string) => void;
  handleLessonDragEnd: (e: React.DragEvent) => void;
  handleLessonDragOver: (e: React.DragEvent) => void;
  handleLessonDragLeave: (e: React.DragEvent) => void;
  handleLessonDrop: (e: React.DragEvent, targetModuleId: string, targetLessonId: string) => void;
  updateLesson: (moduleId: string, lessonId: string, data: Partial<Lesson>) => void;
  openDeleteLessonModal: (moduleId: string, lessonId: string) => void;
  // Tabs and optional content
  lessonActiveTab: Record<string, "resources" | "questions" | "assignment" | null>;
  setLessonActiveTab: React.Dispatch<React.SetStateAction<Record<string, "resources" | "questions" | "assignment" | null>>>;
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

export default function ModuleCard({
  courseId,
  module,
  isExpanded,
  isDragging,
  submittingModuleId,
  handleModuleDragStart,
  handleModuleDragEnd,
  handleModuleDragOver,
  handleModuleDragLeave,
  handleModuleDrop,
  toggleModuleExpansion,
  expandedLessons,
  toggleLessonExpansion,
  editingModuleId,
  setEditingModule,
  updateModule,
  openDeleteModuleModal,
  createModuleAndAllLessons,
  createLesson,
  draggedLesson,
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
}: ModuleCardProps) {
  return (
    <div
      className={`border rounded-lg bg-white dark:bg-gray-800 transition-all duration-200 ${isDragging ? "opacity-50" : ""}`}
      draggable
      aria-grabbed={isDragging}
      onDragStart={(e) => handleModuleDragStart(e, module.id)}
      onDragEnd={handleModuleDragEnd}
      onDragOver={handleModuleDragOver}
      onDragLeave={handleModuleDragLeave}
      onDrop={(e) => handleModuleDrop(e, module.id)}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 cursor-move hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-hidden="true" />
          <button
            type="button"
            onClick={() => toggleModuleExpansion(module.id)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            aria-expanded={isExpanded}
            aria-controls={`module-${module.id}`}
            aria-label={`${isExpanded ? "Collapse" : "Expand"} module ${module.title}`}
            title={`${isExpanded ? "Collapse" : "Expand"} module`}
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" aria-hidden="true" /> : <ChevronRight className="w-5 h-5" aria-hidden="true" />}
          </button>

          {editingModuleId === module.id ? (
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
                requestAnimationFrame(() => {
                  try {
                    e.currentTarget.select();
                  } catch {}
                });
              }}
            />
          ) : (
            <h3
              className="text-lg font-medium text-gray-900 dark:text-white cursor-text"
              onClick={() => setEditingModule(module.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setEditingModule(module.id);
              }}
              title="Click to rename module"
            >
              {module.title}
            </h3>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button type="button" onClick={() => setEditingModule(editingModuleId === module.id ? null : module.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Edit module title" title="Edit title">
            <Edit className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              openDeleteModuleModal(module.id);
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
            aria-label="Create or update module with all lessons"
            title="Create or update module + all lessons"
            disabled={submittingModuleId === module.id}
            aria-busy={submittingModuleId === module.id}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium">{module.lessons.length > 0 ? "Update Module" : "Create Module"}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div id={`module-${module.id}`} className="p-4 space-y-4">
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">Lessons</h4>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => createLesson(module.id)} className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors" aria-label="Add lesson">
                  <Plus className="w-3 h-3" aria-hidden="true" />
                  <span>Add Lesson</span>
                </button>
              </div>
            </div>

            {module.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                courseId={courseId}
                moduleId={module.id}
                lesson={lesson}
                isExpanded={expandedLessons.has(lesson.id)}
                isDragging={draggedLesson?.lessonId === lesson.id}
                editingLessonId={editingLessonId}
                setEditingLesson={setEditingLesson}
                handleLessonDragStart={handleLessonDragStart}
                handleLessonDragEnd={handleLessonDragEnd}
                handleLessonDragOver={handleLessonDragOver}
                handleLessonDragLeave={handleLessonDragLeave}
                handleLessonDrop={handleLessonDrop}
                toggleLessonExpansion={toggleLessonExpansion}
                updateLesson={updateLesson}
                openDeleteLessonModal={openDeleteLessonModal}
                lessonActiveTab={lessonActiveTab}
                setLessonActiveTab={setLessonActiveTab}
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
