"use client";

import React from "react";
import { ChevronDown, ChevronRight, Edit, GripVertical, Plus, Trash2 } from "lucide-react";
import type { Module } from "../types";

export interface ModuleHeaderProps {
  module: Module;
  isExpanded: boolean;
  submittingModuleId: string | null;
  editingModuleId: string | null;
  setEditingModule: (id: string | null) => void;
  toggleModuleExpansion: (moduleId: string) => void;
  updateModule: (moduleId: string, data: Partial<Module>) => void;
  openDeleteModuleModal: (moduleId: string) => void;
  createModuleAndAllLessons: (moduleId: string) => void;
}

/**
 * ModuleHeader renders drag handle, expand/collapse, inline title editing,
 * and primary actions for the module (delete, create/update).
 */
export default function ModuleHeader({ module, isExpanded, submittingModuleId, editingModuleId, setEditingModule, toggleModuleExpansion, updateModule, openDeleteModuleModal, createModuleAndAllLessons }: ModuleHeaderProps) {
  return (
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
  );
}
