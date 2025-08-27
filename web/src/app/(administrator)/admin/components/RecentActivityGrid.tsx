import React from "react";
import Link from "next/link";
import { FileText, Users, BookOpen } from "lucide-react";

interface Post {
  id: string;
  title: string;
  published: boolean;
  author: string;
  viewCount: number;
  tags: string[];
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: string;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  published: boolean;
  students: number;
}

interface RecentActivityGridProps {
  recentPosts: Post[];
  recentUsers: User[];
  recentCourses: Course[];
}

/**
 * Recent activity grid component for admin dashboard
 */
export const RecentActivityGrid: React.FC<RecentActivityGridProps> = ({ recentPosts, recentUsers, recentCourses }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Recent Posts */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
        <Link href="/admin/blog" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {recentPosts.map((post) => (
          <div key={post.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.author} • {post.viewCount} views
              </p>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.published ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
              {post.published ? "Live" : "Draft"}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Users */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h3>
        <Link href="/admin/users" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {recentUsers.map((user) => (
          <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
            <span className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Courses */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Courses</h3>
        <Link href="/admin/courses" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {recentCourses.map((course) => (
          <div key={course.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{course.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {course.instructor} • {course.students} students
              </p>
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.published ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}`}>
              {course.published ? "Live" : "Draft"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
