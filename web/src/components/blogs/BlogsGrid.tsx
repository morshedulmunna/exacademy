import React from "react";
import Link from "next/link";
import { Post } from "../../lib/types";
import FeaturedBlogsSection from "./FeaturedBlogsSection";
import RecentBlogsSection from "./RecentBlogsSection";

/**
 * Main blogs grid layout component that coordinates featured and recent sections
 */
interface BlogsGridProps {
  featuredBlogs: Post[];
  smallBlogs: Post[];
}

export default function BlogsGrid({ featuredBlogs, smallBlogs }: BlogsGridProps) {
  return (
    <>
      {/* Dynamic Blog Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 auto-rows-min">
        <FeaturedBlogsSection featuredBlogs={featuredBlogs} smallBlogs={smallBlogs} />
        <RecentBlogsSection smallBlogs={smallBlogs} />
      </div>

      {/* Mobile View All Button */}
      <div className="flex justify-center mt-8 lg:hidden">
        <Link href="/blog" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-3 rounded-md text-sm transition-colors duration-200 inline-flex items-center gap-2">
          View All Posts
          <span>→</span>
        </Link>
      </div>
    </>
  );
}
