"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

// Separate button components for client-side interactivity
const AddToCartButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-700"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
  >
    Add to Cart
  </button>
);

const ViewCourseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }}
  >
    View Course
  </button>
);

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
  instructorTitle?: string;
  instructorBio?: string;
  price: number;
  originalPrice?: number | null;
  rating?: number;
  reviews?: number;
  isBestseller?: boolean;
  lastUpdated?: string;
  studentsEnrolled?: number;
  courseCategory?: string;
  difficultyLevel?: string;
  learningOutcomes?: string[];
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
  instructorAvatar,
  instructorTitle,
  instructorBio,
  price,
  originalPrice,
  rating,
  reviews,
  isBestseller,
  lastUpdated,
  studentsEnrolled,
  courseCategory,
  difficultyLevel,
  learningOutcomes,
}: CourseCardProps) {
  const handleAddToCart = () => {
    // Add to cart functionality here
  };

  const handleViewCourse = () => {
    // View course functionality here
  };

  return (
    <>
      <Link href={`/course/${slug}`} className="block">
        <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
          {/* Course Thumbnail */}
          <div className="relative h-48 overflow-hidden">
            <Image src={thumbnail || "/placeholder-logo.png"} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            {/* Bestseller Badge */}
            {isBestseller && <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Bestseller</div>}
            {/* Course Category Badge */}
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">{courseCategory}</div>
            {/* Hover Overlay with Quick Info */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center p-4">
                <div className="text-sm mb-2">
                  ⭐ {rating || 4.8} ({reviews?.toLocaleString() || "2,847"} reviews)
                </div>
                <div className="text-xs mb-2">
                  {duration} • {lessons} lessons • {difficultyLevel}
                </div>
                <div className="text-xs">{excerpt || description?.substring(0, 80)}...</div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="p-4">
            {/* Course Title */}
            <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground group-hover:text-blue-600 transition-colors">{title}</h3>

            {/* Instructor Info */}
            <div className="flex items-center gap-2 mb-2">
              {instructorAvatar && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={instructorAvatar} alt={instructorName || "Instructor"} fill className="object-cover" />
                </div>
              )}
              <div className="text-sm text-muted-foreground truncate">
                {instructorName}
                {instructorTitle && <span className="text-xs"> • {instructorTitle}</span>}
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="text-sm font-medium">{rating || 4.8}</span>
              <span className="text-xs text-muted-foreground">({reviews?.toLocaleString() || "2,847"})</span>
            </div>

            {/* Course Meta Info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span>{duration}</span>
              <span>•</span>
              <span>{lessons} lessons</span>
              <span>•</span>
              <span>{difficultyLevel}</span>
            </div>

            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">${price}</span>
                {originalPrice && originalPrice > price && <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>}
              </div>
            </div>
          </div>

          {/* Hover Details Panel - Slides up from bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-4 border-t border-border">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">What you'll learn:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {learningOutcomes?.map((outcome: string, index: number) => (
                  <li key={index}>• {outcome}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">{lastUpdated ? `Updated ${new Date(lastUpdated).toLocaleDateString("en-US", { month: "long", year: "numeric" })}` : `Updated ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}</span>
                <ViewCourseButton onClick={handleViewCourse} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
