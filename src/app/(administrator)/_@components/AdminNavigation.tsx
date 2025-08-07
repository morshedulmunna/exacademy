"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText, BookOpen, Tag } from "lucide-react";

/**
 * Admin Navigation Component
 * Displays the admin panel navigation menu with active state
 */
export default function AdminNavigation() {
  const pathname = usePathname();
  const navItems = [
    {
      href: "/admin-handler",
      icon: Shield,
      label: "Dashboard",
    },
    {
      href: "/admin-handler/posts",
      icon: FileText,
      label: "Posts",
    },
    {
      href: "/admin-handler/courses",
      icon: BookOpen,
      label: "Courses",
    },
    {
      href: "/admin-handler/tags",
      icon: Tag,
      label: "Tags",
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-900/50 transition-colors duration-200">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin-handler" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive ? "border-purple-500 text-purple-600 dark:text-purple-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
