import React from "react";
import { PageHeader, StatsGrid, SearchFilters, PostTable } from "./components";

/**
 * Blog Management Page
 * Clean, component-based admin interface for managing blog posts
 */
export default function BlogManagementPage() {
  // Static sample data
  const posts = [
    {
      id: "p1",
      title: "Getting Started with Web Development",
      slug: "getting-started-web-development",
      excerpt: "A comprehensive guide for beginners starting their web development journey",
      published: true,
      createdAt: "2024-01-15",
      author: { name: "John Doe", email: "john@example.com" },
      tags: ["Web Dev", "Beginner"],
      viewCount: 120,
      readTime: 8,
    },
    {
      id: "p2",
      title: "Advanced React Patterns",
      slug: "advanced-react-patterns",
      excerpt: "Learn advanced React patterns and best practices for production applications",
      published: true,
      createdAt: "2024-01-14",
      author: { name: "Jane Smith", email: "jane@example.com" },
      tags: ["React", "Advanced"],
      viewCount: 89,
      readTime: 12,
    },
    {
      id: "p3",
      title: "CSS Grid Layout Guide",
      slug: "css-grid-layout-guide",
      excerpt: "Master CSS Grid layout with practical examples and use cases",
      published: false,
      createdAt: "2024-01-13",
      author: { name: "Mike Johnson", email: "mike@example.com" },
      tags: ["CSS", "Layout"],
      viewCount: 0,
      readTime: 6,
    },
    {
      id: "p4",
      title: "TypeScript Best Practices",
      slug: "typescript-best-practices",
      excerpt: "Essential TypeScript patterns and practices for better code quality",
      published: true,
      createdAt: "2024-01-12",
      author: { name: "Sarah Wilson", email: "sarah@example.com" },
      tags: ["TypeScript", "Best Practices"],
      viewCount: 156,
      readTime: 10,
    },
    {
      id: "p5",
      title: "Node.js Performance Optimization",
      slug: "nodejs-performance-optimization",
      excerpt: "Techniques to optimize Node.js applications for better performance",
      published: false,
      createdAt: "2024-01-11",
      author: { name: "David Lee", email: "david@example.com" },
      tags: ["Node.js", "Performance"],
      viewCount: 0,
      readTime: 15,
    },
  ];

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.published).length,
    draftPosts: posts.filter((p) => !p.published).length,
    totalViews: posts.reduce((sum, p) => sum + p.viewCount, 0),
    totalReadTime: posts.reduce((sum, p) => sum + p.readTime, 0),
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Blog Posts" subtitle="Manage your blog content and publications" newPostUrl="/admin/blog/new" />

      <StatsGrid stats={stats} />
      <SearchFilters />
      <PostTable posts={posts} />
    </div>
  );
}
