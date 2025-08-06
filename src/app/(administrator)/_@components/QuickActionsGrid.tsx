import React from "react";
import QuickActionCard from "./QuickActionCard";

/**
 * Quick Actions Grid Component
 * Displays a grid of quick action cards for the admin dashboard
 */
export default function QuickActionsGrid() {
  const quickActions = [
    {
      href: "/admin-handler/posts",
      title: "Manage Posts",
      description: "Create, edit, and publish blog posts",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      bgColor: "bg-blue-500",
      hoverColor: "text-blue-600 dark:text-blue-400"
    },
    {
      href: "/admin-handler/courses",
      title: "Manage Courses",
      description: "Create and manage online courses",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      bgColor: "bg-green-500",
      hoverColor: "text-green-600 dark:text-green-400"
    },
    {
      href: "/admin-handler/tags",
      title: "Manage Tags",
      description: "Organize content with tags",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      bgColor: "bg-purple-500",
      hoverColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quickActions.map((action, index) => (
        <QuickActionCard
          key={index}
          href={action.href}
          title={action.title}
          description={action.description}
          icon={action.icon}
          bgColor={action.bgColor}
          hoverColor={action.hoverColor}
        />
      ))}
    </div>
  );
} 