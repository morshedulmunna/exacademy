import { DashboardHeader, StatsGrid, SimpleChart } from "./_@components";
import { TrendingUp, Users, Eye, BookOpen, Calendar, Clock, ArrowUpRight, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";

/**
 * Admin Dashboard Page
 * Clean, static admin interface without backend dependencies
 */
export default function AdminDashboard() {
  // Static placeholder metrics for demonstration
  const stats = {
    totalPosts: 10,
    publishedPosts: 7,
    draftPosts: 3,
    totalUsers: 120,
    totalTags: 8,
    totalViews: 5320,
    totalCourses: 4,
    publishedCourses: 3,
    draftCourses: 1,
    totalEnrollments: 56,
  };

  const recentPosts = [
    { id: "p1", title: "Getting Started with Web Development", published: true, author: "John Doe", viewCount: 120, tags: ["Web Dev", "Beginner"], createdAt: "2024-01-15" },
    { id: "p2", title: "Advanced React Patterns", published: true, author: "Jane Smith", viewCount: 89, tags: ["React", "Advanced"], createdAt: "2024-01-14" },
    { id: "p3", title: "CSS Grid Layout Guide", published: false, author: "Mike Johnson", viewCount: 0, tags: ["CSS", "Layout"], createdAt: "2024-01-13" },
  ];

  const recentUsers = [
    { id: "u1", name: "Alice Brown", email: "alice@example.com", createdAt: "2024-01-15", avatar: undefined },
    { id: "u2", name: "Bob Wilson", email: "bob@example.com", createdAt: "2024-01-14", avatar: undefined },
    { id: "u3", name: "Carol Davis", email: "carol@example.com", createdAt: "2024-01-13", avatar: undefined },
  ];

  const recentCourses = [
    { id: "c1", title: "Complete Web Development Bootcamp", instructor: "Sarah Wilson", published: true, students: 45 },
    { id: "c2", title: "React Masterclass", instructor: "David Lee", published: true, students: 32 },
    { id: "c3", title: "Advanced JavaScript", instructor: "Lisa Chen", published: false, students: 0 },
  ];

  // Calculate engagement metrics
  const engagementRate = stats.totalUsers > 0 ? ((stats.totalViews / stats.totalUsers) * 100).toFixed(1) : "0";
  const publishRate = stats.totalPosts > 0 ? ((stats.publishedPosts / stats.totalPosts) * 100).toFixed(1) : "0";

  // Sample chart data
  const viewsData = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 180 },
    { label: "Wed", value: 150 },
    { label: "Thu", value: 220 },
    { label: "Fri", value: 190 },
    { label: "Sat", value: 160 },
    { label: "Sun", value: 140 },
  ];

  const userGrowthData = [
    { label: "Jan", value: 50 },
    { label: "Feb", value: 75 },
    { label: "Mar", value: 90 },
    { label: "Apr", value: 120 },
    { label: "May", value: 150 },
    { label: "Jun", value: 180 },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {/* Enhanced Stats Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Business Overview</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% from last month</span>
          </div>
        </div>
        <StatsGrid
          totalPosts={stats.totalPosts}
          publishedPosts={stats.publishedPosts}
          draftPosts={stats.draftPosts}
          totalUsers={stats.totalUsers}
          totalCourses={stats.totalCourses}
          publishedCourses={stats.publishedCourses}
          draftCourses={stats.draftCourses}
          totalEnrollments={stats.totalEnrollments}
        />
      </div>

      {/* Simple Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Views */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">+8.2% from last week</p>
            </div>
            <Eye className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{engagementRate}%</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Per user average</p>
            </div>
            <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Publish Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Publish Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{publishRate}%</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Content completion</p>
            </div>
            <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Course Completion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Course Completion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">78%</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Student success rate</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Views</h3>
          <SimpleChart title="Weekly Views" data={viewsData} />
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
          <SimpleChart title="User Growth" data={userGrowthData} />
        </div>
      </div>

      {/* Recent Activity Grid */}
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

      {/* Quick Actions */}
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
    </div>
  );
}
