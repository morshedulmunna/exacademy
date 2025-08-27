"use client";

import React, { useState } from "react";
import { LessonsList } from "./components";

/**
 * Course Detail Page - Udemy Style Design
 * Page for learners to view course content and track progress
 */
export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [expandedModules, setExpandedModules] = useState<string[]>(["m1"]);

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

  const handleLessonClick = (lessonId: string) => {
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

  return (
    <div className="animate-fadeIn">
      <LessonsList modules={updatedModules} onLessonClick={handleLessonClick} onModuleToggle={handleModuleToggle} />
    </div>
  );
}
