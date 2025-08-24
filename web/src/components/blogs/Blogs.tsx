import React from "react";
import { Button } from "../ui/button";
import SmallArticleCard from "./SmallArticleCard";
import FeaturesBlogCard from "./FeaturesBlogCard";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Post } from "@/lib/types";

async function fetchPosts(_params: Record<string, string | number>): Promise<{
  posts: Post[];
  pagination: { page: number; limit: number; total: number; pages: number };
}> {
  return { posts: [] as Post[], pagination: { page: 1, limit: 0, total: 0, pages: 0 } };
}

export default async function Blogs() {
  const [featured, recent] = await Promise.all([fetchPosts({ page: 1, limit: 2, featured: "true" }), fetchPosts({ page: 1, limit: 8 })]);

  const featuredBlogs = featured.posts;
  const smallBlogs = recent.posts.filter((p) => !p.featured).slice(0, 6);

  return (
    <>
      <section className="py-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-foreground">Latest Blog Posts</h2>
              <p className="text-muted-foreground">Sharing insights on software engineering, tech trends, and development practices.</p>
            </div>
            <Link href="/blog" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-md text-sm md:flex transition-colors">
              View All Posts
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {featuredBlogs.map((post) => (
                <FeaturesBlogCard
                  key={post.id}
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
                  tags={(post.tags || []).map((t) => t.name)}
                  featured={post.featured}
                  status={post.published ? "published" : "draft"}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {smallBlogs.map((post) => (
                <SmallArticleCard
                  key={post.id}
                  title={post.title}
                  description={post.excerpt || ""}
                  excerpt={post.excerpt}
                  date={formatDate(post.publishedAt || post.createdAt)}
                  readTime={`${post.readTime} min read`}
                  tags={(post.tags || []).map((t) => t.name)}
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
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 md:hidden">
            <Button variant="outline">View All Posts</Button>
          </div>
        </div>
      </section>
    </>
  );
}
