import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { StaticImageData } from "next/image";
import ImageWithFallback from "../ui/image-with-fallback";
import PlaceholderImage from "../ui/placeholder-image";

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

export default function FeaturesBlogCard({ title, description, excerpt, date, readTime, category, author, authorImage, imageUrl, url, likes, comments, views, tags, featured, status }: FeaturesBlogCardProps) {
  return (
    <>
      <div className="h-fit bg-zinc-900 rounded-xl overflow-hidden group hover:bg-zinc-800 transition-colors mb-4 relative">
        {/* Featured Badge */}
        {featured && <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">⭐ FEATURED</div>}
        {/* Image */}
        <Link href={url} target="_blank" className="block relative h-48 lg:h-[350px]">
          {imageUrl ? (
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={featured}
              fallbackComponent={<PlaceholderImage title={title} size="lg" />}
            />
          ) : (
            <PlaceholderImage title={title} size="lg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="p-4 ">
          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-400 flex-wrap">
            <span className="flex items-center gap-1">📅 {date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">⏱️ {readTime}</span>
            <span>•</span>
            <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs font-medium">{category}</span>
          </div>
          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2">
            <Link href={url} target="_blank">
              {title}
            </Link>
          </h3>
          {/* Description/Excerpt */}
          <p className="text-gray-400 mb-4 line-clamp-3">{excerpt || description}</p>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {tags.slice(0, 4).map((tag, index) => (
                <span key={index} className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-gray-300 hover:bg-zinc-700 transition-colors">
                  #{tag}
                </span>
              ))}
              {tags.length > 4 && <span className="text-xs text-gray-500">+{tags.length - 4} more</span>}
            </div>
          )}
          {/* Author and Stats */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {authorImage ? (
                <ImageWithFallback
                  src={authorImage}
                  alt={author}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-zinc-700"
                  fallbackComponent={<div className="w-10 h-10 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center text-sm font-medium">{author.charAt(0).toUpperCase()}</div>}
                />
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-zinc-700 bg-zinc-800 flex items-center justify-center text-sm font-medium">{author.charAt(0).toUpperCase()}</div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-300 block">{author}</span>
                <span className="text-xs text-gray-500">Author</span>
              </div>
            </div>
            {/* Engagement Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
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
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors duration-300 font-medium" asChild>
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
