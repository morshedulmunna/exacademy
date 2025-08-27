import React from "react";
import { BookOpen, Clock, Star, User, Share, MoreVertical, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CourseLayoutProps {
  children: React.ReactNode;
}

/**
 * Course Detail Layout - Separate from main dashboard layout
 * Matches Udemy course page design with top navigation
 */
export default function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar - Udemy Style */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Logo and Course Title */}
            <div className="flex items-center space-x-6">
              {/* Back Button */}
              <Link 
                href="/dashboard/my-courses"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              {/* Course Title */}
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-md">
                  DevOps Beginners to Advanced with Projects
                </h1>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Leave Rating */}
              <button className="hidden sm:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>Leave a rating</span>
              </button>

              {/* Progress */}
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span>Your progress</span>
              </button>

              {/* Share */}
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Share
              </button>

              {/* More Options */}
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
