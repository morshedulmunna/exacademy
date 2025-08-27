import React, { useState } from "react";
import { CourseHeader, LessonsList } from "./components";

/**
 * Course Detail Page
 * Page for learners to view course content and track progress
 */
export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const [expandedModules, setExpandedModules] = useState<string[]>(["m1"]);

  // Mock data for demonstration
  const course = {
    id: params.courseId,
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Wilson",
    thumbnail: "/api/placeholder/300/200",
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    totalDuration: 18,
    rating: 4.8,
    category: "Web Development"
  };

  const modules = [
    {
      id: "m1",
      title: "Getting Started with Web Development",
      description: "Learn the basics of HTML, CSS, and JavaScript",
      isExpanded: expandedModules.includes("m1"),
      lessons: [
        {
          id: "l1",
          title: "Introduction to HTML",
          duration: 15,
          type: "video" as const,
          status: "completed" as const,
          isLocked: false
        },
        {
          id: "l2",
          title: "HTML Structure and Elements",
          duration: 20,
          type: "video" as const,
          status: "completed" as const,
          isLocked: false
        },
        {
          id: "l3",
          title: "HTML Forms and Inputs",
          duration: 25,
          type: "video" as const,
          status: "in-progress" as const,
          isLocked: false
        },
        {
          id: "l4",
          title: "HTML Quiz",
          duration: 10,
          type: "quiz" as const,
          status: "not-started" as const,
          isLocked: false
        }
      ]
    },
    {
      id: "m2",
      title: "CSS Fundamentals",
      description: "Master CSS styling and layout techniques",
      isExpanded: expandedModules.includes("m2"),
      lessons: [
        {
          id: "l5",
          title: "CSS Basics and Selectors",
          duration: 18,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: false
        },
        {
          id: "l6",
          title: "CSS Box Model",
          duration: 22,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: false
        },
        {
          id: "l7",
          title: "CSS Flexbox Layout",
          duration: 30,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true
        }
      ]
    },
    {
      id: "m3",
      title: "JavaScript Essentials",
      description: "Learn JavaScript programming fundamentals",
      isExpanded: expandedModules.includes("m3"),
      lessons: [
        {
          id: "l8",
          title: "JavaScript Variables and Data Types",
          duration: 20,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true
        },
        {
          id: "l9",
          title: "JavaScript Functions",
          duration: 25,
          type: "video" as const,
          status: "not-started" as const,
          isLocked: true
        }
      ]
    }
  ];

  const handleLessonClick = (lessonId: string) => {
    console.log(`Navigating to lesson: ${lessonId}`);
    // Navigate to lesson page or open lesson content
  };

  const handleModuleToggle = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const updatedModules = modules.map(module => ({
    ...module,
    isExpanded: expandedModules.includes(module.id)
  }));

  return (
    <div className="space-y-6">
      <CourseHeader course={course} />
      <LessonsList 
        modules={updatedModules}
        onLessonClick={handleLessonClick}
        onModuleToggle={handleModuleToggle}
      />
    </div>
  );
}
