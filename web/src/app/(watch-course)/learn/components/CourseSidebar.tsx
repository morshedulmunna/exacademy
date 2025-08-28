import React, { useRef, useEffect, useState } from "react";
import { MessageSquare, MoreVertical } from "lucide-react";
import { CourseSidebarHeader } from "./CourseSidebarHeader";
import { ModuleList } from "./ModuleList";
import { Lesson, Module } from "./types";

interface CourseSidebarProps {
  modules: Module[];
  onLessonClick: (lessonId: string) => void;
  onModuleToggle: (moduleId: string) => void;
  currentLesson?: string | null;
}

/**
 * Course sidebar component containing course content and progress
 */
export const CourseSidebar: React.FC<CourseSidebarProps> = ({ modules, onLessonClick, onModuleToggle, currentLesson }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  // Calculate dynamic sidebar height based on viewport
  useEffect(() => {
    const updateSidebarHeight = () => {
      if (sidebarRef.current) {
        const viewportHeight = window.innerHeight;
        const headerHeight = 80; // Approximate header height
        const padding = 48; // 24px top + 24px bottom
        const newHeight = viewportHeight - headerHeight - padding;
        setSidebarHeight(Math.max(newHeight, 400)); // Minimum height of 400px
      }
    };

    updateSidebarHeight();
    window.addEventListener("resize", updateSidebarHeight);
    return () => window.removeEventListener("resize", updateSidebarHeight);
  }, []);

  const getTotalModuleDuration = (lessons: Lesson[]) => {
    return lessons.reduce((total, lesson) => total + lesson.duration, 0);
  };

  const getProgressPercentage = (lessons: Lesson[]) => {
    const completed = lessons.filter((lesson) => lesson.status === "completed").length;
    return lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}hr ${remainingMinutes}min` : `${hours}hr`;
  };

  return (
    <div className="lg:col-span-3">
      <div
        ref={sidebarRef}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transform transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] hover:shadow-xl"
        style={{ height: sidebarHeight }}
      >
        {/* Enhanced Header */}
        <CourseSidebarHeader
          totalLessons={modules.reduce((total, module) => total + module.lessons.length, 0)}
          totalDuration={formatDuration(modules.reduce((total, module) => total + getTotalModuleDuration(module.lessons), 0))}
          progressPercentage={getProgressPercentage(modules.flatMap((m) => m.lessons))}
        />

        {/* Enhanced Course Content List */}
        <div className="overflow-y-auto h-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] delay-1200" style={{ height: `calc(${sidebarHeight}px - 120px)` }}>
          <ModuleList modules={modules} onLessonClick={onLessonClick} onModuleToggle={onModuleToggle} currentLesson={currentLesson} />
        </div>
      </div>
    </div>
  );
};
