// Backend removed; keep static admin UI only
import { DashboardHeader, StatsGrid, SimpleChart } from "../_@components";
import { TrendingUp, Users, Eye, BookOpen, Calendar, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Admin Dashboard Page
 * Only accessible to users with ADMIN role
 * Enhanced for course selling and blog publishing business
 */
export default async function AdminDashboard() {
  // Static placeholder metrics
  const [totalPosts, publishedPosts, draftPosts, totalUsers, totalTags, totalViews, totalCourses, publishedCourses, draftCourses, totalEnrollments] = [10, 7, 3, 120, 8, { _sum: { viewCount: 5320 } }, 4, 3, 1, 56] as any;
  const recentPosts = [
    { id: "p1", title: "Sample Post", published: true, author: { name: "Author" }, viewCount: 120, tags: [1, 2], createdAt: new Date().toISOString() },
  ] as any[];
  const recentUsers = [
    { id: "u1", name: "Jane Doe", email: "jane@example.com", createdAt: new Date().toISOString(), avatar: undefined },
  ] as any[];
  const recentCourses = [
    { id: "c1", title: "Sample Course", instructor: { name: "Instructor" }, published: true },
  ] as any[];
  const topViewedPosts = [
    { id: "p1", title: "Popular Post", author: { name: "Author" }, viewCount: 420 },
  ] as any[];

  const totalViewsCount = totalViews._sum.viewCount || 0;

  // Calculate engagement metrics
  const engagementRate = totalUsers > 0 ? ((totalViewsCount / totalUsers) * 100).toFixed(1) : "0";
  const publishRate = totalPosts > 0 ? ((publishedPosts / totalPosts) * 100).toFixed(1) : "0";

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
        <StatsGrid totalPosts={totalPosts} publishedPosts={publishedPosts} draftPosts={draftPosts} totalUsers={totalUsers} totalCourses={totalCourses} publishedCourses={publishedCourses} draftCourses={draftCourses} totalEnrollments={totalEnrollments} />
      </div>

      {/* Simple Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Views */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViewsCount.toLocaleString()}</p>
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
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Content published</p>
            </div>
            <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Revenue Estimate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Est. Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">৳{Math.floor(totalUsers * 50).toLocaleString()}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Based on users</p>
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChart title="Views Over Time" data={viewsData} type="bar" height={200} />
          <SimpleChart title="User Growth" data={userGrowthData} type="line" height={200} />
        </div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blog Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Blog Posts</h2>
            <Link href="/admin-handler/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm flex items-center">
              View all <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className={`w-2 h-2 rounded-full ${post.published ? "bg-green-500" : "bg-yellow-500"}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>by {post.author.name}</span>
                    <span>•</span>
                    <span>{post.viewCount} views</span>
                    <span>•</span>
                    <span>{post.tags.length} tags</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Users</h2>
            <Link href="/admin-handler/users" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm flex items-center">
              View all <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">{user.avatar ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" /> : user.name.charAt(0).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Courses</h2>
            <Link href="/admin-handler/courses" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm flex items-center">
              View all <ArrowUpRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{course.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">by {course.instructor.name}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${course.published ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200" : "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200"}`}>
                    {course.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Content</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>
        <div className="space-y-4">
          {topViewedPosts.map((post, index) => (
            <div key={post.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm">{index + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">by {post.author.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.viewCount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                New user registered - <span className="font-medium">John Doe</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                Blog post published - <span className="font-medium">"Docker Best Practices"</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                Course purchase - <span className="font-medium">Docker Mastery Course</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                High engagement - <span className="font-medium">500+ views on "React Tutorial"</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
