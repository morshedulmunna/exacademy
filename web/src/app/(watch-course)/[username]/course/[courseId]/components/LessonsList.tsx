import React, { useState } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { CourseTabs } from "./CourseTabs";
import { CourseSidebar } from "./CourseSidebar";
import { Module, Lesson } from "./types";

interface LessonsListProps {
  modules: Module[];
  onLessonClick: (lessonId: string) => void;
  onModuleToggle: (moduleId: string) => void;
  currentLesson?: string | null;
}

/**
 * Main Lessons list component that orchestrates the video player, tabs, and sidebar
 */
export const LessonsList: React.FC<LessonsListProps> = ({ modules, onLessonClick, onModuleToggle, currentLesson }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
      {/* Main Content Area - Video Player and Tabs */}
      <div className="col-span-1 lg:col-span-9">
        {/* Enhanced Video Player */}
        <VideoPlayer title="DevOps Beginners to Advanced" description="Master DevOps with hands-on projects" duration="56 hours" moduleCount={modules.length} />

        {/* Enhanced Tabs Navigation */}
        <CourseTabs />
      </div>

      {/* Enhanced Right Sidebar - Course Content */}
      <CourseSidebar modules={modules} onLessonClick={onLessonClick} onModuleToggle={onModuleToggle} currentLesson={currentLesson} />
    </div>
  );
};
