import { DashboardHeader } from "./_@components";
import { OverviewStats, MetricsGrid, ChartsSection, RecentActivityGrid, QuickActions } from "./components";

/**
 * Admin Dashboard Page
 * Clean, component-based admin interface without backend dependencies
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

      <OverviewStats {...stats} />
      <MetricsGrid totalViews={stats.totalViews} engagementRate={engagementRate} publishRate={publishRate} />
      <ChartsSection viewsData={viewsData} userGrowthData={userGrowthData} />
      <RecentActivityGrid recentPosts={recentPosts} recentUsers={recentUsers} recentCourses={recentCourses} />
      <QuickActions />
    </div>
  );
}
