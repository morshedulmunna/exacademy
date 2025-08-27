import React from "react";
import Link from "next/link";

/**
 * Header component for the blogs section with title and navigation
 */
interface BlogsHeaderProps {
  title?: string;
  description?: string;
  viewAllUrl?: string;
}

export default function BlogsHeader({ title = "Latest Blog Posts", description = "Sharing insights on software engineering, tech trends, and development practices.", viewAllUrl = "/blog" }: BlogsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 lg:mb-16">
      <div className="max-w-2xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 text-foreground">{title}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{description}</p>
      </div>
      <Link href={viewAllUrl} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-md text-sm transition-colors duration-200 inline-flex items-center gap-2 w-fit">
        View All Posts
        <span>→</span>
      </Link>
    </div>
  );
}
