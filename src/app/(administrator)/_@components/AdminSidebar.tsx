"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { useThemeGradients } from "@/components/ui/ThemeGradients";
import { Shield, FileText, BookOpen, Tag, Users, Settings, BarChart3, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Admin Sidebar Component
 * Displays the admin panel sidebar navigation with collapsible design
 */
export default function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const gradients = useThemeGradients();

  const navItems = [
    {
      href: "/admin-handler",
      icon: Shield,
      label: "Dashboard",
      description: "Overview & Analytics",
    },
    {
      href: "/admin-handler/blog",
      icon: FileText,
      label: "Blog Posts",
      description: "Manage blog content",
    },
    {
      href: "/admin-handler/courses",
      icon: BookOpen,
      label: "Courses",
      description: "Manage courses",
    },
    {
      href: "/admin-handler/tags",
      icon: Tag,
      label: "Tags",
      description: "Manage tags",
    },
    {
      href: "/admin-handler/users",
      icon: Users,
      label: "Users",
      description: "User management",
    },
    {
      href: "/admin-handler/analytics",
      icon: BarChart3,
      label: "Analytics",
      description: "Site statistics",
    },
    {
      href: "/admin-handler/messages",
      icon: MessageSquare,
      label: "Messages",
      description: "User messages",
    },
    {
      href: "/admin-handler/settings",
      icon: Settings,
      label: "Settings",
      description: "System settings",
    },
  ];

  // Update main content padding when sidebar state changes
  React.useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.style.paddingLeft = isCollapsed ? "4rem" : "16rem";
    }
  }, [isCollapsed]);

  return (
    <aside className={`bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-full overflow-y-auto ${isCollapsed ? "w-16" : "w-64"}`}>
      {/* Toggle button */}
      <div className="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={`p-2 rounded-lg ${gradients.bgGradient} text-white transition-all duration-200 ${gradients.hoverBgGradient}`}>
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin-handler" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive ? `${gradients.activeBgGradient} ${gradients.primaryText} border-r-2 ${gradients.borderColor}` : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-purple-900/10 dark:hover:to-pink-900/10"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? gradients.iconColor : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-purple-400"}`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? gradients.textGradient : "text-gray-900 dark:text-white"}`}>{item.label}</p>
                  <p className={`text-xs truncate ${isActive ? gradients.secondaryText : "text-gray-500 dark:text-gray-400"}`}>{item.description}</p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick stats when expanded */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`${gradients.bgGradient} rounded-lg p-4 text-white shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Quick Stats</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs opacity-75">Active users today</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
