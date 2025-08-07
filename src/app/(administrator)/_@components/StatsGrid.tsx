import React from "react";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";
import StatsCard from "./StatsCard";

interface StatsGridProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
}

/**
 * Stats Grid Component
 * Displays key statistics in a responsive grid layout
 */
export default function StatsGrid({ totalPosts, publishedPosts, draftPosts, totalUsers }: StatsGridProps) {
  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "blue",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Published Posts",
      value: publishedPosts,
      icon: Eye,
      color: "green",
      change: "+8%",
      changeType: "increase" as const,
    },
    {
      title: "Draft Posts",
      value: draftPosts,
      icon: FileText,
      color: "yellow",
      change: "-3%",
      changeType: "decrease" as const,
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "purple",
      change: "+15%",
      changeType: "increase" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        // Explicitly cast color to the allowed type to satisfy StatsCardProps
        <StatsCard key={index} {...stat} color={stat.color as "blue" | "green" | "yellow" | "purple" | "red"} />
      ))}
    </div>
  );
}
