import React from "react";
import { FileText, Users, Eye, TrendingUp, BookOpen } from "lucide-react";
import StatsCard from "./StatsCard";

interface StatsGridProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
}

/**
 * Stats Grid Component
 * Displays key business statistics in a responsive grid layout
 * Simplified design with minimal colors
 */
export default function StatsGrid({ totalPosts, publishedPosts, draftPosts, totalUsers }: StatsGridProps) {
  // Calculate additional metrics
  const publishRate = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;
  const estimatedRevenue = totalUsers * 50; // Rough estimate based on user base

  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "gray" as const,
      change: "+12%",
      changeType: "increase" as const,
      description: "Blog content created",
    },
    {
      title: "Published Posts",
      value: publishedPosts,
      icon: Eye,
      color: "gray" as const,
      change: `+${publishRate}%`,
      changeType: "increase" as const,
      description: "Live content",
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "gray" as const,
      change: "+15%",
      changeType: "increase" as const,
      description: "Registered users",
    },
    {
      title: "Est. Revenue",
      value: `৳${estimatedRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "gray" as const,
      change: "+8%",
      changeType: "increase" as const,
      description: "Based on user base",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
