import React from "react";
import { Post } from "../../lib/types";
import { fetchPosts } from "./BlogsData";
import BlogsHeader from "./BlogsHeader";
import BlogsGrid from "./BlogsGrid";

/**
 * Main Blogs component that orchestrates the blog display
 * Fetches data and renders the blog layout with header and grid
 */
export default async function Blogs() {
  // Fetch featured and recent posts in parallel
  const [featured, recent] = await Promise.all([fetchPosts({ page: 1, limit: 2, featured: "true" }), fetchPosts({ page: 1, limit: 8 })]);

  const featuredBlogs = featured.posts;
  const smallBlogs = recent.posts.filter((p: Post) => !p.featured).slice(0, 6);

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlogsHeader />
        <BlogsGrid featuredBlogs={featuredBlogs} smallBlogs={smallBlogs} />
      </div>
    </section>
  );
}
