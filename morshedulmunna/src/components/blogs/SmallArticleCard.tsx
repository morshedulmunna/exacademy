import React from "react";
import Link from "next/link";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface SmallArticleCardProps {
  title: string;
  description: string;
  excerpt?: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  readTime: string;
  readingTime?: number;
  tags: string[];
  url: string;
  slug: string;
  likes?: number;
  comments?: number;
  views?: number;
  category?: string;
  author?: string;
  authorImage?: string | StaticImageData;
  imageUrl?: string;
  featured?: boolean;
  status?: string;
}

export default function SmallArticleCard({ title, description, excerpt, date, readTime, tags, url, likes, comments, views, category, author, authorImage, imageUrl, featured, status }: SmallArticleCardProps) {
  return (
    <>
      <article className="bg-card rounded-xl overflow-hidden group hover:bg-accent transition-colors border border-border">
        {/* Featured Badge */}
        {featured && <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-bold px-3 py-1 text-center">FEATURED</div>}

        {/* Image */}
        {imageUrl && (
          <div className="relative h-32 overflow-hidden">
            <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}

        <div className="p-4">
          {/* Meta Info */}
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime}</span>
            {category && (
              <>
                <span>•</span>
                <span className="bg-secondary px-2 py-1 rounded text-xs text-secondary-foreground">{category}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2 text-foreground">
            <Link href={url} target="_blank" className="hover:text-cyan-400 transition-colors">
              {title}
            </Link>
          </h3>

          {/* Description/Excerpt */}
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{excerpt || description}</p>

          {/* Tags */}
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-secondary px-2 py-1 rounded text-xs text-secondary-foreground">
                {tag}
              </span>
            ))}
            {tags.length > 3 && <span className="text-xs text-muted-foreground">+{tags.length - 3} more</span>}
          </div>

          {/* Author and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {authorImage && <Image src={authorImage} alt={author || "Author"} width={20} height={20} className="rounded-full" />}
              {author && <span className="text-xs text-foreground">{author}</span>}
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {views && (
                <span className="flex items-center gap-1">
                  <span>👁</span>
                  {views > 1000 ? `${(views / 1000).toFixed(1)}k` : views}
                </span>
              )}
              {likes && (
                <span className="flex items-center gap-1">
                  <span>❤️</span>
                  {likes}
                </span>
              )}
              {comments && (
                <span className="flex items-center gap-1">
                  <span>💬</span>
                  {comments}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
