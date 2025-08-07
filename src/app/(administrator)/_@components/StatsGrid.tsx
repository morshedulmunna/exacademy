import React from "react";
import { FileText, Users, Eye, TrendingUp, BookOpen, GraduationCap, DollarSign } from "lucide-react";
import StatsCard from "./StatsCard";

interface StatsGridProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
}

/**
 * Stats Grid Component
 * Displays key business statistics in a responsive grid layout
 * Enhanced for course selling and blog publishing business
 */
export default function StatsGrid({ 
  totalPosts, 
  publishedPosts, 
  draftPosts, 
  totalUsers,
  totalCourses,
  publishedCourses,
  draftCourses,
  totalEnrollments
}: StatsGridProps) {
  // Calculate additional metrics
  const postPublishRate = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;
  const coursePublishRate = totalCourses > 0 ? Math.round((publishedCourses / totalCourses) * 100) : 0;
  const estimatedRevenue = totalEnrollments * 50; // Rough estimate based on enrollments

  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "blue" as const,
      change: `+${postPublishRate}%`,
      changeType: "increase" as const,
      description: "Blog content created",
    },
    {
      title: "Published Posts",
      value: publishedPosts,
      icon: Eye,
      color: "green" as const,
      change: "+12%",
      changeType: "increase" as const,
      description: "Live content",
    },
    {
      title: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "purple" as const,
      change: `+${coursePublishRate}%`,
      changeType: "increase" as const,
      description: "Courses created",
    },
    {
      title: "Published Courses",
      value: publishedCourses,
      icon: GraduationCap,
      color: "indigo" as const,
      change: "+8%",
      changeType: "increase" as const,
      description: "Live courses",
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "pink" as const,
      change: "+15%",
      changeType: "increase" as const,
      description: "Registered users",
    },
    {
      title: "Total Enrollments",
      value: totalEnrollments,
      icon: TrendingUp,
      color: "yellow" as const,
      change: "+22%",
      changeType: "increase" as const,
      description: "Course enrollments",
    },
    {
      title: "Est. Revenue",
      value: `$${estimatedRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "green" as const,
      change: "+18%",
      changeType: "increase" as const,
      description: "Based on enrollments",
    },
    {
      title: "Draft Content",
      value: draftPosts + draftCourses,
      icon: FileText,
      color: "gray" as const,
      change: "-5%",
      changeType: "decrease" as const,
      description: "Unpublished content",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
