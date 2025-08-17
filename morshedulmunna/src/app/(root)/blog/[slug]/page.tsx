import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import Image from "next/image";
import React from "react";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { notFound } from "next/navigation";
import LikeButton from "@/components/blogs/LikeButton";
import Comments from "@/components/blogs/Comments";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function getPost(slug: string) {
  // Static placeholder for UI-only build
  return {
    id: "1",
    title: "Static Blog Post",
    slug,
    excerpt: "Example excerpt",
    content: "# Hello World\n\nThis is a static post.",
    coverImage: undefined,
    viewCount: 0,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    readTime: 4,
    author: { name: "Author", avatar: undefined },
    tags: [{ id: "t1", name: "Tag", color: "#888888" }],
  };
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
