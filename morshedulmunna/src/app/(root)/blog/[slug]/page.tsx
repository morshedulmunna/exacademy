import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import Image from "next/image";
import React from "react";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { notFound } from "next/navigation";
import LikeButton from "@/components/blogs/LikeButton";
import Comments from "@/components/blogs/Comments";
import { headers } from "next/headers";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  try {
    const hdrs = await headers();
    const host = hdrs.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const apiUrl = `${protocol}://${host}/api/posts/${slug}`;

    const response = await fetch(apiUrl, { cache: "no-store" });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogDetailsPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <MaxWidthWrapper className="max-w-screen-lg">
      {post.coverImage && <img src={post.coverImage} className="w-full h-[50vh] object-cover border-none rounded bg-gray-800" alt={post.title} />}

      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            {post.author.avatar && <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />}
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span>•</span>
          <span>{post.readTime} min read</span>
          <span>•</span>
          <span>{post.viewCount} views</span>
          <span>•</span>
          <LikeButton slug={post.slug} />
        </div>

        <h1 className="text-4xl font-bold">{post.title}</h1>

        {post.excerpt && <p className="text-lg text-gray-600">{post.excerpt}</p>}

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2">
            {post.tags.map((tag: any) => (
              <span key={tag.id} className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: tag.color + "20", color: tag.color }}>
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-8">
          <MarkdownRenderer content={post.content} />
        </div>

        <Comments slug={post.slug} />
      </div>
    </MaxWidthWrapper>
  );
}
