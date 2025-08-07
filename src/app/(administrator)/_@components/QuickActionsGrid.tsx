import React from "react";
import { Plus, FileText, BookOpen, Tag, Users, Settings, BarChart3, DollarSign, Video, MessageSquare } from "lucide-react";
import QuickActionCard from "./QuickActionCard";

/**
 * Quick Actions Grid Component
 * Displays quick action buttons for common admin tasks
 * Enhanced for course selling and blog publishing business
 */
export default function QuickActionsGrid() {
  const actions = [
    {
      title: "Create Post",
      description: "Add a new blog post",
      icon: Plus,
      href: "/admin-handler/blog/new",
      color: "blue",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Manage Posts",
      description: "Edit existing blog posts",
      icon: FileText,
      href: "/admin-handler/blog",
      color: "green",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Create Course",
      description: "Add a new course",
      icon: BookOpen,
      href: "/admin-handler/courses/new",
      color: "purple",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      title: "Manage Courses",
      description: "Edit existing courses",
      icon: Video,
      href: "/admin-handler/courses",
      color: "indigo",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
    },
    {
      title: "Analytics",
      description: "View performance metrics",
      icon: BarChart3,
      href: "/admin-handler/analytics",
      color: "yellow",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: "Revenue",
      description: "Track sales and earnings",
      icon: DollarSign,
      href: "/admin-handler/revenue",
      color: "green",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "User Management",
      description: "Manage user accounts",
      icon: Users,
      href: "/admin-handler/users",
      color: "pink",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
    },
    {
      title: "Manage Tags",
      description: "Organize content tags",
      icon: Tag,
      href: "/admin-handler/tags",
      color: "orange",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      title: "Comments",
      description: "Moderate user comments",
      icon: MessageSquare,
      href: "/admin-handler/comments",
      color: "teal",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200 dark:border-teal-800",
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: Settings,
      href: "/admin-handler/settings",
      color: "gray",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      borderColor: "border-gray-200 dark:border-gray-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {actions.map((action, index) => (
        <QuickActionCard key={index} {...action} />
      ))}
    </div>
  );
}
