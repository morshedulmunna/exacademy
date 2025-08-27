import React from "react";
import { formatDate } from "@/lib/utils";
import { Post } from "../../lib/types";
import SmallArticleCard from "./SmallArticleCard";

/**
 * Recent blogs sidebar section component
 */
interface RecentBlogsSectionProps {
  smallBlogs: Post[];
}

export default function RecentBlogsSection({ smallBlogs }: RecentBlogsSectionProps) {
  return (
    <div className="xl:col-span-4 lg:col-span-5">
      <div className="sticky top-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-3">Recent Articles</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 auto-rows-min">
          {smallBlogs.length > 0 ? (
            smallBlogs.map((post: Post) => (
              <div key={post.id} className={`transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${smallBlogs.length === 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <SmallArticleCard
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
