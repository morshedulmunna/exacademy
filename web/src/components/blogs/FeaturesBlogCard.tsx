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
        {featured && <div className="absolute top-2 left-2 z-10 gradient-bg text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">⭐ FEATURED</div>}
        {/* Image */}
        <Link href={`/blog/${slug}`} className="block relative h-24 lg:h-72">
          {imageUrl && <Image src={imageUrl} alt={title} fill className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="p-3">
          {/* Meta Info */}
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">📅 {date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">⏱️ {readTime}</span>
            <span>•</span>
            <span className="bg-secondary px-2 py-1 rounded-full text-xs font-medium text-secondary-foreground">{category}</span>
          </div>
          {/* Title */}
          <h3 className="text-base font-bold mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2 text-foreground">
            <Link href={`/blog/${slug}`}>{title}</Link>
          </h3>
          {/* Description/Excerpt */}
          <p className="text-muted-foreground mb-3 line-clamp-2 text-xs">{excerpt || description}</p>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              {tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="bg-secondary px-2 py-1 rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  #{tag}
                </span>
              ))}
              {tags.length > 2 && <span className="text-xs text-muted-foreground">+{tags.length - 2} more</span>}
            </div>
          )}
          {/* Author and Stats */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {authorImage && <Image src={authorImage} alt={author} width={24} height={24} className="rounded-full h-8 w-8 border border-border" />}
              <div>
                <span className="text-xs font-medium text-foreground block">{author}</span>
              </div>
            </div>
            {/* Engagement Stats */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
            </div>
          </div>
          {/* Read More Button */}
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" className="font-medium text-foreground hover:underline hover:text-blue-600 dark:hover:text-blue-400 text-xs p-1 h-auto" asChild>
              <Link href={url} target="_blank">
                Read More →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
