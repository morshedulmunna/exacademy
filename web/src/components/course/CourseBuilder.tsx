"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { Module } from "./builder/types";
import useCourseBuilder from "./builder/useCourseBuilder";
import { getContentIcon } from "./builder/contentIcons";
import ConfirmDialog from "@common/ConfirmDialog";
import ModuleCard from "./builder/components/ModuleCard";

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
    deleteModal,
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
    openDeleteModuleModal,
    openDeleteLessonModal,
    closeDeleteModal,
    confirmDelete,
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
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            courseId={courseId}
            module={module}
            isExpanded={expandedModules.has(module.id)}
            isDragging={draggedModule === module.id}
            submittingModuleId={submittingModuleId}
            handleModuleDragStart={handleModuleDragStart}
            handleModuleDragEnd={handleModuleDragEnd}
            handleModuleDragOver={handleModuleDragOver}
            handleModuleDragLeave={handleModuleDragLeave}
            handleModuleDrop={handleModuleDrop}
            toggleModuleExpansion={toggleModuleExpansion}
            editingModuleId={editingModule}
            setEditingModule={setEditingModule}
            updateModule={updateModule}
            openDeleteModuleModal={openDeleteModuleModal}
            createModuleAndAllLessons={createModuleAndAllLessons}
            createLesson={createLesson}
            draggedLesson={draggedLesson}
            editingLessonId={editingLesson}
            setEditingLesson={setEditingLesson}
            handleLessonDragStart={handleLessonDragStart}
            handleLessonDragEnd={handleLessonDragEnd}
            handleLessonDragOver={handleLessonDragOver}
            handleLessonDragLeave={handleLessonDragLeave}
            handleLessonDrop={handleLessonDrop}
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

      {modules.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No modules created yet. Click "Add Module" to get started.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        title={deleteModal.target?.kind === "lesson" ? "Delete Lesson" : "Delete Module"}
        description={deleteModal.target?.kind === "lesson" ? "Are you sure you want to delete this lesson? This action cannot be undone." : "Are you sure you want to delete this module and all its lessons? This action cannot be undone."}
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
