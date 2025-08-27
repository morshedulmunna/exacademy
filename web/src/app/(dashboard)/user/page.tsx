import React from "react";
import { DashboardHeader, ProgressOverview, CurrentCourses, RecommendedCourses, RecentActivity } from "./components";

/**
 * Learner Dashboard Page
 * Comprehensive dashboard for learners to track progress and access courses
 */
export default function DashboardPage() {
  // Mock data for demonstration
  const userData = {
    userName: "John Doe",
    userEmail: "john@example.com",
    avatar: undefined,
  };

  const progressData = {
    totalCourses: 5,
    completedCourses: 2,
    totalHours: 24,
    certificates: 2,
    currentStreak: 7,
  };

  const currentCourses = [
    {
      id: "c1",
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Wilson",
      thumbnail: "/api/placeholder/300/200",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      totalDuration: 18,
      lastAccessed: "2024-01-15T10:30:00Z",
    },
    {
      id: "c2",
      title: "React Masterclass",
      instructor: "David Lee",
      thumbnail: "/api/placeholder/300/200",
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      totalDuration: 12,
      lastAccessed: "2024-01-14T15:45:00Z",
    },
  ];

  const recommendedCourses = [
    {
      id: "c3",
      title: "Advanced JavaScript Concepts",
      instructor: "Lisa Chen",
      thumbnail: "/api/placeholder/300/200",
      rating: 4.8,
      totalStudents: 1250,
      price: 79.99,
      duration: 15,
      category: "JavaScript",
      isEnrolled: false,
    },
    {
      id: "c4",
      title: "Node.js Backend Development",
      instructor: "Mike Johnson",
      thumbnail: "/api/placeholder/300/200",
      rating: 4.7,
      totalStudents: 890,
      price: 89.99,
      duration: 20,
      category: "Backend",
      isEnrolled: false,
    },
    {
      id: "c5",
      title: "UI/UX Design Fundamentals",
      instructor: "Alex Brown",
      thumbnail: "/api/placeholder/300/200",
      rating: 4.6,
      totalStudents: 650,
      price: 59.99,
      duration: 12,
      category: "Design",
      isEnrolled: false,
    },
  ];

  const recentActivities = [
    {
      id: "a1",
      type: "lesson_completed" as const,
      title: "Lesson Completed",
      description: "Completed 'Introduction to HTML' in Web Development Bootcamp",
      timestamp: "2024-01-15T10:30:00Z",
      icon: null as any,
      color: "",
    },
    {
      id: "a2",
      type: "course_enrolled" as const,
      title: "Course Enrolled",
      description: "Enrolled in React Masterclass",
      timestamp: "2024-01-14T15:45:00Z",
      icon: null as any,
      color: "",
    },
    {
      id: "a3",
      type: "certificate_earned" as const,
      title: "Certificate Earned",
      description: "Earned certificate for JavaScript Basics",
      timestamp: "2024-01-13T14:20:00Z",
      icon: null as any,
      color: "",
    },
    {
      id: "a4",
      type: "quiz_passed" as const,
      title: "Quiz Passed",
      description: "Passed CSS Fundamentals quiz with 85%",
      timestamp: "2024-01-12T11:15:00Z",
      icon: null as any,
      color: "",
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader {...userData} />
      <ProgressOverview {...progressData} />
      <CurrentCourses courses={currentCourses} />
      <RecommendedCourses courses={recommendedCourses} />
      <RecentActivity activities={recentActivities} />
    </div>
  );
}
