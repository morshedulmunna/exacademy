import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export interface CourseCardProps {
  title: string;
  slug: string;
  description?: string;
  excerpt?: string;
  thumbnail?: string;
  duration?: string;
  lessons?: number;
  instructorName?: string;
  instructorAvatar?: string;
  price: number;
  originalPrice?: number | null;
  tags?: { name: string; slug?: string }[];
}

export default function CourseCard({
  title,
  slug,
  description,
  excerpt,
  thumbnail,
  duration,
  lessons,
  instructorName,
  // instructorAvatar, // reserved for future use in card footer if needed
  price,
  originalPrice,
  tags = [],
}: CourseCardProps) {
  return (
    <>
      <div className="h-fit bg-card rounded-xl overflow-hidden group hover:bg-accent transition-colors mb-4 relative border border-border">
        {/* Image */}
        <Link href={`/course/${slug}`} className="block relative h-40 lg:h-48">
          <Image src={thumbnail || "/placeholder-logo.png"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="p-2">
          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">📚 Course</span>
            {duration && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">⏱️ {duration}</span>
              </>
            )}
            {typeof lessons === "number" && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">{lessons} lessons</span>
              </>
            )}
          </div>
          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 text-foreground">
            <Link href={`/course/${slug}`}>{title}</Link>
          </h3>
          {/* Description */}
          {(excerpt || description) && <p className="text-muted-foreground text-sm mb-2 line-clamp-3">{excerpt || description}</p>}
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {tags.slice(0, 4).map((tag) => (
                <span key={tag.slug ?? tag.name} className="bg-secondary px-3 py-1 rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
          {/* Price and Action */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div>
                {instructorName && <span className="text-sm font-medium text-foreground block">{instructorName}</span>}
                <span className="text-xs text-muted-foreground">Instructor</span>
              </div>
            </div>
            {/* Price */}
            <div className="text-right">
              <p className="text-card-foreground text-xl font-medium">${price}</p>
              {originalPrice && originalPrice > price ? <p className="text-xs text-muted-foreground line-through">${originalPrice}</p> : null}
            </div>
          </div>
          {/* View Course Button */}
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" className="font-medium text-foreground hover:underline hover:text-blue-600 dark:hover:text-blue-400" asChild>
              <Link href={`/course/${slug}`}>View Course →</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
