import React from "react";
import { PageHeader, OverviewStats, ChartsSection, TopPerformingCourses, UserEngagement, RecentActivity, KeyMetrics } from "./components";

/**
 * Analytics Page
 * Clean, component-based admin interface for viewing analytics and insights
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
      <PageHeader title="Analytics & Insights" subtitle="Track performance, growth, and user engagement" timeRange="Last 30 days" />

      <OverviewStats stats={overviewStats} />
      <ChartsSection revenueData={revenueData} userGrowthData={userGrowthData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPerformingCourses courses={topPerformingCourses} />
        <UserEngagement engagementData={userEngagementData} />
      </div>

      <RecentActivity activities={recentActivity} />
      <KeyMetrics />
    </div>
  );
}
