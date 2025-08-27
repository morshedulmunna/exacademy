import React from "react";
import { formatDate } from "@/lib/utils";
import { Post } from "../../lib/types";
import FeaturesBlogCard from "./FeaturesBlogCard";
import SmallArticleCard from "./SmallArticleCard";

/**
 * Featured blogs section component for the main content area
 */
interface FeaturedBlogsSectionProps {
  featuredBlogs: Post[];
  smallBlogs: Post[];
}

export default function FeaturedBlogsSection({ featuredBlogs, smallBlogs }: FeaturedBlogsSectionProps) {
  return (
    <div className="xl:col-span-8 lg:col-span-7">
      <div className="gap-4 auto-rows-fr">
        {/* Featured Posts */}
        <div>
          {featuredBlogs.length > 0 ? (
            featuredBlogs.map((post: Post) => (
              <div key={post.id} className={`transition-all duration-300 hover:scale-[1.02] ${featuredBlogs.length === 1 ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`}>
                <FeaturesBlogCard
                  title={post.title}
                  description={post.excerpt || ""}
                  excerpt={post.excerpt}
                  date={formatDate(post.publishedAt || post.createdAt)}
                  readTime={`${post.readTime} min read`}
                  category={post.tags?.[0]?.name || "General"}
                  author={post.author?.name || post.author?.username || "Unknown"}
                  authorImage={post.author?.avatar || "/placeholder-user.jpg"}
                  imageUrl={post.coverImage}
                  url={`/blog/${post.slug}`}
                  slug={post.slug}
                  likes={post._count?.likes}
                  comments={post._count?.comments}
                  views={post.viewCount}
                  tags={(post.tags || []).map((t: { name: string }) => t.name)}
                  featured={post.featured}
                  status={post.published ? "published" : "draft"}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-12 sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <p className="text-muted-foreground">No featured posts available.</p>
            </div>
          )}
        </div>

        {/* Small Blog Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {smallBlogs.length > 0 ? (
            smallBlogs.map((post: Post) => (
              <div key={post.id} className={`transition-all duration-300 hover:scale-[1.02] ${smallBlogs.length === 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <SmallArticleCard
                  isNoCover={true}
                  title={post.title}
                  description={post.excerpt || ""}
                  excerpt={post.excerpt}
                  date={formatDate(post.publishedAt || post.createdAt)}
                  readTime={`${post.readTime} min read`}
                  tags={(post.tags || []).map((t: { name: string }) => t.name)}
                  url={`/blog/${post.slug}`}
                  slug={post.slug}
                  likes={post._count?.likes}
                  comments={post._count?.comments}
                  views={post.viewCount}
                  category={post.tags?.[0]?.name}
                  author={post.author?.name || post.author?.username}
                  authorImage={post.author?.avatar || "/placeholder-user.jpg"}
                  imageUrl={post.coverImage}
                  featured={post.featured}
                  status={post.published ? "published" : "draft"}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 sm:col-span-2 lg:col-span-1">
              <p className="text-muted-foreground text-sm">No recent posts available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
