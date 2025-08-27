"use client";

import React, { useState, useEffect } from "react";
import { LessonsList } from "./components";
import "./components/course-styles.css";

/**
 * Enhanced Course Detail Page with improved UI/UX
 * Page for learners to view course content and track progress
 */
export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [expandedModules, setExpandedModules] = useState<string[]>(["m1"]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);

  // Mock data for demonstration
  const modules = [
    {
      id: "m1",
      title: "Getting Started with DevOps",
      description: "Learn the basics of DevOps practices and tools",
      isExpanded: expandedModules.includes("m1"),
      lessons: [
        {
          id: "l1",
          title: "Introduction to DevOps",
          duration: 15,
          type: "video" as const,
          status: "completed" as const,
          isLocked: false,
        },
        {
          id: "l2",
          title: "DevOps Culture and Principles",
          duration: 20,
          type: "video" as const,
          status: "completed" as const,
          isLocked: false,
        },
        {
          id: "l3",
          title: "DevOps Tools Overview",
          duration: 25,
          type: "video" as const,
          status: "in-progress" as const,
          isLocked: false,
        },
        {
          id: "l4",
          title: "DevOps Quiz",
          duration: 10,
          type: "quiz" as const,
          status: "not-started" as const,
          isLocked: false,
        },
      ],
    },
    {
      id: "m2",
      title: "Linux Fundamentals",
      description: "Master Linux commands and system administration",
      isExpanded: expandedModules.includes("m2"),
      lessons: [
        {
          id: "l5",
          title: "Linux Basics and Commands",
          duration: 18,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: false,
        },
        {
          id: "l6",
          title: "File System Management",
          duration: 22,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: false,
        },
        {
          id: "l7",
          title: "User and Permission Management",
          duration: 30,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true,
        },
      ],
    },
    {
      id: "m3",
      title: "Docker and Containerization",
      description: "Learn Docker fundamentals and container orchestration",
      isExpanded: expandedModules.includes("m3"),
      lessons: [
        {
          id: "l8",
          title: "Docker Basics",
          duration: 20,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true,
        },
        {
          id: "l9",
          title: "Docker Images and Containers",
          duration: 25,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true,
        },
        {
          id: "l10",
          title: "Docker Compose",
          duration: 35,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true,
        },
      ],
    },
    {
      id: "m4",
      title: "Kubernetes Orchestration",
      description: "Master Kubernetes deployment and management",
      isExpanded: expandedModules.includes("m4"),
      lessons: [
        {
          id: "l11",
          title: "Kubernetes Architecture",
          duration: 28,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true,
        },
        {
          id: "l12",
          title: "Pods and Services",
          duration: 32,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true,
        },
      ],
    },
  ];

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLessonClick = (lessonId: string) => {
    setCurrentLesson(lessonId);
    console.log(`Navigating to lesson: ${lessonId}`);
    // Navigate to lesson page or open lesson content
  };

  const handleModuleToggle = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]));
  };

  const updatedModules = modules.map((module) => ({
    ...module,
    isExpanded: expandedModules.includes(module.id),
  }));

  if (isLoading) {
    return (
      <div className="animate-fadeIn">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Loading skeleton for main content */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl aspect-video skeleton"></div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded skeleton mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton w-3/4"></div>
            </div>
          </div>

          {/* Loading skeleton for sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded skeleton mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded skeleton"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn ">
      <LessonsList modules={updatedModules} onLessonClick={handleLessonClick} onModuleToggle={handleModuleToggle} currentLesson={currentLesson} />
    </div>
  );
}
