import React from "react";
import { ModuleItem } from "./ModuleItem";
import { Lesson, Module } from "./types";

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
