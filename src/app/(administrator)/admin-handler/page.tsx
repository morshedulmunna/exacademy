import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { DashboardHeader, StatsGrid, QuickActionsGrid } from "../_@components";

/**
 * Admin Dashboard Page
 * Only accessible to users with ADMIN role
 */
export default async function AdminDashboard() {
  const user = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch admin statistics
  const [totalPosts, publishedPosts, draftPosts, totalUsers, totalTags] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.user.count(),
    prisma.tag.count()
  ]);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      {/* Stats Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview</h2>
        <StatsGrid 
          totalPosts={totalPosts} 
          publishedPosts={publishedPosts} 
          draftPosts={draftPosts} 
          totalUsers={totalUsers} 
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <QuickActionsGrid />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">New user registered</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">Blog post published</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">Course updated</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
