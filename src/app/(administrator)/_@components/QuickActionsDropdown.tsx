"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, FileText, BookOpen, Tag, Users, Settings, BarChart3, DollarSign, Video, MessageSquare } from "lucide-react";
import Link from "next/link";

/**
 * Quick Actions Dropdown Component
 * Provides a dropdown-style interface for common admin tasks
 */
export default function QuickActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const actions = [
    {
      title: "Create Post",
      description: "Add a new blog post",
      icon: Plus,
      href: "/admin-handler/blog/new",
    },
    {
      title: "Manage Posts",
      description: "Edit existing blog posts",
      icon: FileText,
      href: "/admin-handler/blog",
    },
    {
      title: "Create Course",
      description: "Add a new course",
      icon: BookOpen,
      href: "/admin-handler/courses/new",
    },
    {
      title: "Manage Courses",
      description: "Edit existing courses",
      icon: Video,
      href: "/admin-handler/courses",
    },
    {
      title: "Analytics",
      description: "View performance metrics",
      icon: BarChart3,
      href: "/admin-handler/analytics",
    },
    {
      title: "Revenue",
      description: "Track sales and earnings",
      icon: DollarSign,
      href: "/admin-handler/revenue",
    },
    {
      title: "User Management",
      description: "Manage user accounts",
      icon: Users,
      href: "/admin-handler/users",
    },
    {
      title: "Manage Tags",
      description: "Organize content tags",
      icon: Tag,
      href: "/admin-handler/tags",
    },
    {
      title: "Comments",
      description: "Moderate user comments",
      icon: MessageSquare,
      href: "/admin-handler/comments",
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: Settings,
      href: "/admin-handler/settings",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-[140px]">
        <div className="flex items-center space-x-2">
          <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white text-sm">Quick Actions</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-10 min-w-[400px]">
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {actions.map((action, index) => (
                <Link key={index} href={action.href} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setIsOpen(false)}>
                  <action.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
