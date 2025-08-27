import React, { useState } from "react";
import { BookOpen, MessageSquare, FileText, Star, Award } from "lucide-react";
import { Tab } from "./types";

interface CourseTabsProps {
  description?: string;
}

/**
 * Course tabs component for navigation between different course sections
 */
export const CourseTabs: React.FC<CourseTabsProps> = ({ description }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs: Tab[] = [
    { id: 0, name: "Overview", icon: BookOpen },
    { id: 1, name: "Q&A", icon: MessageSquare },
    { id: 2, name: "Notes", icon: FileText },
    { id: 3, name: "Announcements", icon: MessageSquare },
    { id: 4, name: "Reviews", icon: Star },
    { id: 5, name: "Learning tools", icon: Award },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Enhanced Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <nav className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Description</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-base">
          {description || "Begin Your DevOps Career As a Newbie | AWS, Linux, Scripting, Jenkins, Ansible, GitOps, Docker, Kubernetes, & Terraform. This comprehensive course will take you from zero to hero in DevOps practices and tools."}
        </p>
      </div>
    </div>
  );
};
