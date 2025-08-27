import React from "react";
import Link from "next/link";
import { FileText, BookOpen, Users, BarChart3 } from "lucide-react";

/**
 * Quick actions component for admin dashboard
 */
export const QuickActions: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link href="/admin/blog/new" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">New Post</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create blog content</p>
        </div>
      </Link>

      <Link href="/admin/courses/new" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">New Course</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create course</p>
        </div>
      </Link>

      <Link href="/admin/users" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Manage Users</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">User administration</p>
        </div>
      </Link>

      <Link href="/admin/analytics" className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">View insights</p>
        </div>
      </Link>
    </div>
  </div>
);
