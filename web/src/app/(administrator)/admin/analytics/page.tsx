import React from "react";
import { TrendingUp, Users, Eye, BookOpen, DollarSign, Calendar, Clock, BarChart3, PieChart, Activity, Target, Award } from "lucide-react";
import { SimpleChart } from "../_@components";

/**
 * Analytics Page
 * Clean, static admin interface for viewing analytics and insights
 */
export default function AnalyticsPage() {
  // Static sample data
  const overviewStats = {
    totalRevenue: 15420.5,
    totalUsers: 1247,
    totalCourses: 23,
    totalPosts: 45,
    monthlyGrowth: 12.5,
    userGrowth: 8.2,
    courseGrowth: 15.3,
    postGrowth: 6.8,
  };

  // Chart data
  const revenueData = [
    { label: "Jan", value: 1200 },
    { label: "Feb", value: 1800 },
    { label: "Mar", value: 1500 },
    { label: "Apr", value: 2200 },
    { label: "May", value: 1900 },
    { label: "Jun", value: 1600 },
    { label: "Jul", value: 2400 },
    { label: "Aug", value: 2100 },
    { label: "Sep", value: 2800 },
    { label: "Oct", value: 3200 },
    { label: "Nov", value: 2900 },
    { label: "Dec", value: 3500 },
  ];

  const userGrowthData = [
    { label: "Jan", value: 50 },
    { label: "Feb", value: 75 },
    { label: "Mar", value: 90 },
    { label: "Apr", value: 120 },
    { label: "May", value: 150 },
    { label: "Jun", value: 180 },
    { label: "Jul", value: 220 },
    { label: "Aug", value: 250 },
    { label: "Sep", value: 280 },
    { label: "Oct", value: 320 },
    { label: "Nov", value: 350 },
    { label: "Dec", value: 400 },
  ];

  const courseEnrollmentData = [
    { label: "Web Dev", value: 45 },
    { label: "React", value: 32 },
    { label: "JavaScript", value: 28 },
    { label: "Node.js", value: 25 },
    { label: "Design", value: 20 },
    { label: "Python", value: 18 },
  ];

  const topPerformingCourses = [
    {
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Wilson",
      enrollments: 45,
      revenue: 4495.55,
      rating: 4.8,
      completionRate: 78,
    },
    {
      title: "React Masterclass",
      instructor: "David Lee",
      enrollments: 32,
      revenue: 2559.68,
      rating: 4.9,
      completionRate: 82,
    },
    {
      title: "Advanced JavaScript",
      instructor: "Lisa Chen",
      enrollments: 28,
      revenue: 1959.72,
      rating: 4.7,
      completionRate: 75,
    },
    {
      title: "Node.js Backend Development",
      instructor: "Mike Johnson",
      enrollments: 25,
      revenue: 2249.75,
      rating: 4.6,
      completionRate: 70,
    },
  ];

  const userEngagementData = [
    { label: "Active Users", value: 847, color: "bg-green-500" },
    { label: "Inactive Users", value: 234, color: "bg-gray-500" },
    { label: "New Users", value: 166, color: "bg-blue-500" },
  ];

  const recentActivity = [
    {
      type: "course_enrollment",
      user: "Alice Brown",
      course: "React Masterclass",
      time: "2 hours ago",
      revenue: 79.99,
    },
    {
      type: "new_user",
      user: "Bob Wilson",
      course: null,
      time: "4 hours ago",
      revenue: 0,
    },
    {
      type: "course_completion",
      user: "Carol Davis",
      course: "Web Development Bootcamp",
      time: "6 hours ago",
      revenue: 0,
    },
    {
      type: "course_enrollment",
      user: "David Lee",
      course: "Advanced JavaScript",
      time: "8 hours ago",
      revenue: 69.99,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track performance, growth, and user engagement</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${overviewStats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">+{overviewStats.monthlyGrowth}%</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overviewStats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">+{overviewStats.userGrowth}%</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overviewStats.totalCourses}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">+{overviewStats.courseGrowth}%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{overviewStats.totalPosts}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 dark:text-green-400">+{overviewStats.postGrowth}%</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <BarChart3 className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Revenue</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Activity className="w-4 h-4" />
              <span>Trending Up</span>
            </div>
          </div>
          <SimpleChart title="Monthly Revenue" data={revenueData} />
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Target className="w-4 h-4" />
              <span>Steady Growth</span>
            </div>
          </div>
          <SimpleChart title="User Growth" data={userGrowthData} />
        </div>
      </div>

      {/* Course Performance & User Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Courses</h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {topPerformingCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{course.instructor}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{course.enrollments} students</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{course.rating}★</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{course.completionRate}% completion</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">${course.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Engagement</h3>
            <PieChart className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-4">
            {userEngagementData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Active Users</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">1,247</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "68%" }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">68% engagement rate</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === "course_enrollment" ? "bg-green-100 dark:bg-green-900/20" : activity.type === "new_user" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-purple-100 dark:bg-purple-900/20"}`}>
                  {activity.type === "course_enrollment" ? (
                    <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : activity.type === "new_user" ? (
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.user}</span>
                    {activity.type === "course_enrollment" && ` enrolled in `}
                    {activity.type === "new_user" && ` joined the platform`}
                    {activity.type === "course_completion" && ` completed `}
                    {activity.course && <span className="font-medium">{activity.course}</span>}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
              {activity.revenue > 0 && <span className="text-sm font-semibold text-green-600 dark:text-green-400">+${activity.revenue}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Average Session</h4>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">24m 32s</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+12% from last month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Conversion Rate</h4>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">3.2%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+0.8% from last month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Growth Rate</h4>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">18.5%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+2.1% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
