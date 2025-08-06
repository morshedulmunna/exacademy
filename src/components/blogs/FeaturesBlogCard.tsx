import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";

interface FeaturesBlogCardProps {
  title: string;
  description: string;
  excerpt?: string;
  date: string;
  publishedAt?: string;
  updatedAt?: string;
  readTime: string;
  readingTime?: number;
  category: string;
  author: string;
  authorImage?: string | StaticImageData;
  imageUrl?: string;
  url: string;
  slug: string;
  likes?: number;
  comments?: number;
  views?: number;
  tags?: string[];
  featured?: boolean;
  status?: string;
}

export default function FeaturesBlogCard({ title, description, slug, excerpt, date, readTime, category, author, authorImage, imageUrl, url, likes, comments, views, tags, featured, status }: FeaturesBlogCardProps) {
  return (
    <>
      <div className="h-fit bg-card rounded-xl overflow-hidden group hover:bg-accent transition-colors mb-4 relative border border-border">
        {/* Featured Badge */}
        {featured && <div className="absolute top-4 left-4 z-10 gradient-bg text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ FEATURED</div>}
        {/* Image */}
        <Link href={`/blog/${slug}`} className="block relative h-48 lg:h-[350px]">
          {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="p-4">
          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">📅 {date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">⏱️ {readTime}</span>
            <span>•</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium text-secondary-foreground">{category}</span>
          </div>
          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 text-foreground">
            <Link href={`/blog/${slug}`}>{title}</Link>
          </h3>
          {/* Description/Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-3">{excerpt || description}</p>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {tags.slice(0, 4).map((tag, index) => (
                <span key={index} className="bg-secondary px-3 py-1 rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  #{tag}
                </span>
              ))}
              {tags.length > 4 && <span className="text-xs text-muted-foreground">+{tags.length - 4} more</span>}
            </div>
          )}
          {/* Author and Stats */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {authorImage && <Image src={authorImage} alt={author} width={40} height={40} className="rounded-full border-2 border-border" />}
              <div>
                <span className="text-sm font-medium text-foreground block">{author}</span>
                <span className="text-xs text-muted-foreground">Author</span>
              </div>
            </div>
            {/* Engagement Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {views && (
                <span className="flex items-center gap-1">
                  <span>👁️</span>
                  <span className="font-medium">{views > 1000 ? `${(views / 1000).toFixed(1)}k` : views}</span>
                </span>
              )}
              {likes && (
                <span className="flex items-center gap-1">
                  <span>❤️</span>
                  <span className="font-medium">{likes}</span>
                </span>
              )}
              {comments && (
                <span className="flex items-center gap-1">
                  <span>💬</span>
                  <span className="font-medium">{comments}</span>
                </span>
              )}
            </div>
          </div>
          {/* Read More Button */}
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" size="sm" className="font-medium text-foreground hover:underline hover:text-blue-600 dark:hover:text-blue-400" asChild>
              <Link href={url} target="_blank">
                Read Full Article →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
