import React from "react";
import StatsCard from "./StatsCard";

interface StatsData {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalUsers: number;
}

/**
 * Stats Grid Component
 * Displays a grid of statistics cards for the admin dashboard
 */
export default function StatsGrid({ totalPosts, publishedPosts, draftPosts, totalUsers }: StatsData) {
  const statsItems = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: "bg-blue-500"
    },
    {
      title: "Published",
      value: publishedPosts,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      bgColor: "bg-green-500"
    },
    {
      title: "Drafts",
      value: draftPosts,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-yellow-500"
    },
    {
      title: "Users",
      value: totalUsers,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      bgColor: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsItems.map((item, index) => (
        <StatsCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          bgColor={item.bgColor}
        />
      ))}
    </div>
  );
} 