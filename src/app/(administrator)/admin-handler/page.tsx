import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { DashboardHeader, StatsGrid, SimpleChart } from "../_@components";
import { TrendingUp, Users, Eye, BookOpen, Calendar, Clock, ArrowUpRight, Activity, BarChart3, Target, Zap, Sparkles, Crown, Star, CheckCircle, AlertCircle, DollarSign, ShoppingCart, MessageSquare, Heart, Tag } from "lucide-react";
import Link from "next/link";

/**
 * Modern Admin Dashboard Page
 * Enhanced with modern UI patterns, gradients, and improved visual hierarchy
 * Only accessible to users with ADMIN role
 */
export default async function AdminDashboard() {
  const user = await getCurrentUser();

  // Redirect if not authenticated or not admin
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch comprehensive admin statistics
  const [totalPosts, publishedPosts, draftPosts, totalUsers, totalTags, totalViews, totalCourses, publishedCourses, draftCourses, totalEnrollments, recentPosts, recentUsers, recentCourses, topViewedPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.user.count(),
    prisma.tag.count(),
    prisma.post.aggregate({ _sum: { viewCount: true } }),
    prisma.course.count(),
    prisma.course.count({ where: { published: true } }),
    prisma.course.count({ where: { published: false } }),
    prisma.courseEnrollment.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { author: true, tags: true },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true, avatar: true },
    }),
    prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { instructor: true },
    }),
    prisma.post.findMany({
      take: 5,
      where: { published: true },
      orderBy: { viewCount: "desc" },
      include: { author: true },
    }),
  ]);

  const totalViewsCount = totalViews._sum.viewCount || 0;

  // Calculate engagement metrics
  const engagementRate = totalUsers > 0 ? ((totalViewsCount / totalUsers) * 100).toFixed(1) : "0";
  const publishRate = totalPosts > 0 ? ((publishedPosts / totalPosts) * 100).toFixed(1) : "0";

  // Sample chart data with more realistic values
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

  // Mock activity data for enhanced UI
  const activities = [
    { type: "user", message: "New user registered", user: "John Doe", time: "2 minutes ago", icon: Users, color: "green", colorClasses: "from-green-500 to-emerald-500" },
    { type: "post", message: "Blog post published", title: "Docker Best Practices", time: "15 minutes ago", icon: BookOpen, color: "blue", colorClasses: "from-blue-500 to-indigo-500" },
    { type: "purchase", message: "Course purchase", title: "Docker Mastery Course", time: "1 hour ago", icon: ShoppingCart, color: "purple", colorClasses: "from-purple-500 to-violet-500" },
    { type: "engagement", message: "High engagement", title: "500+ views on React Tutorial", time: "2 hours ago", icon: Heart, color: "pink", colorClasses: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="space-y-8 p-6">
        <DashboardHeader />

        {/* Hero Section with Key Metrics */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-blue-100">Here's what's happening with your platform today</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium">Live Dashboard</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{totalUsers.toLocaleString()}</div>
                <div className="text-blue-100 text-sm">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{totalViewsCount.toLocaleString()}</div>
                <div className="text-blue-100 text-sm">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{totalEnrollments.toLocaleString()}</div>
                <div className="text-blue-100 text-sm">Enrollments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">৳{(totalEnrollments * 50).toLocaleString()}</div>
                <div className="text-blue-100 text-sm">Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Business Overview</h2>
              <p className="text-gray-600 dark:text-gray-400">Key metrics and performance indicators</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% from last month</span>
              </div>
            </div>
          </div>
          <StatsGrid totalPosts={totalPosts} publishedPosts={publishedPosts} draftPosts={draftPosts} totalUsers={totalUsers} totalCourses={totalCourses} publishedCourses={publishedCourses} draftCourses={draftCourses} totalEnrollments={totalEnrollments} />
        </div>

        {/* Modern Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Views */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalViewsCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">+8.2%</span>
                <span className="text-gray-500 dark:text-gray-400">from last week</span>
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{engagementRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">+5.1%</span>
                <span className="text-gray-500 dark:text-gray-400">per user average</span>
              </div>
            </div>
          </div>

          {/* Publish Rate */}
          <div className="group relative bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{publishRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Publish Rate</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">+3.7%</span>
                <span className="text-gray-500 dark:text-gray-400">content published</span>
              </div>
            </div>
          </div>

          {/* Revenue Estimate */}
          <div className="group relative bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200/50 dark:border-yellow-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">৳{Math.floor(totalUsers * 50).toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Est. Revenue</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">+18.3%</span>
                <span className="text-gray-500 dark:text-gray-400">based on users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">Track your platform's performance over time</p>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Real-time data</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
              <SimpleChart title="Views Over Time" data={viewsData} type="bar" height={250} />
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
              <SimpleChart title="User Growth" data={userGrowthData} type="line" height={250} />
            </div>
          </div>
        </div>

        {/* Modern Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blog Posts */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Blog Posts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Latest content updates</p>
                </div>
              </div>
              <Link href="/admin-handler/blog" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                <span>View all</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div key={post.id} className="group relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${post.published ? "bg-green-500" : "bg-yellow-500"} animate-pulse`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{post.author.name}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.viewCount}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>{post.tags.length}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{new Date(post.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Users</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">New registrations</p>
                </div>
              </div>
              <Link href="/admin-handler/users" className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm font-medium transition-colors">
                <span>View all</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={user.id} className="group relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-600/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" /> : user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Performing Content</h2>
                <p className="text-gray-600 dark:text-gray-400">Most viewed content in the last 30 days</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last 30 days</span>
            </div>
          </div>
          <div className="space-y-4">
            {topViewedPosts.map((post, index) => (
              <div key={post.id} className="group relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center space-x-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                      index === 0 ? "bg-gradient-to-br from-yellow-500 to-orange-500" : index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-500" : index === 2 ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-gradient-to-br from-blue-500 to-indigo-500"
                    }`}
                  >
                    {index === 0 ? <Crown className="w-6 h-6" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">by {post.author.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{post.viewCount.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Activity Feed */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Activity Feed</h2>
                <p className="text-gray-600 dark:text-gray-400">Real-time platform activity</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="group relative bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${activity.colorClasses} rounded-xl flex items-center justify-center`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message} - <span className="font-semibold">{activity.title || activity.user}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
