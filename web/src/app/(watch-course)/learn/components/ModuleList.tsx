import React from "react";
import { Lesson, Module } from "./types";
import { ModuleItem } from "./ModuleItem";

interface ModuleListProps {
  modules: Module[];
  onLessonClick: (lessonId: string) => void;
  onModuleToggle: (moduleId: string) => void;
  currentLesson?: string | null;
}

/**
 * Module list component containing all course modules
 */
export const ModuleList: React.FC<ModuleListProps> = ({ modules, onLessonClick, onModuleToggle, currentLesson }) => {
  return (
    <div className="p-2">
      {modules.map((module) => (
        <ModuleItem key={module.id} module={module} onLessonClick={onLessonClick} onModuleToggle={onModuleToggle} currentLesson={currentLesson} />
      ))}
    </div>
  );
};
