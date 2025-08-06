import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

type Props = {};

export default function CourseCard({}: Props) {
  return (
    <>
      <div className="h-fit bg-card rounded-xl overflow-hidden group hover:bg-accent transition-colors mb-4 relative border border-border">
        {/* Image */}
        <Link href="/course/docker-mastery" className="block relative h-40 lg:h-48">
          <Image src="/docker-course.png" alt="Docker Mastery Course" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        <div className="p-2">
          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">📚 Course</span>
            <span>•</span>
            <span className="flex items-center gap-1">⏱️ 12 hours</span>
            <span>•</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-xs font-medium text-secondary-foreground">Docker</span>
          </div>
          {/* Title */}
          <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors line-clamp-2 text-foreground">
            <Link href="/course/docker-mastery">Docker Mastery Course</Link>
          </h3>
          {/* Description */}
          <p className="text-muted-foreground text-sm mb-2 line-clamp-3">In this course, you will learn everything you need to know about Docker, a powerful tool for creating, deploying, and managing containerized applications.</p>
          {/* Tags */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="bg-secondary px-3 py-1 rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors">#Docker</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors">#Containers</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors">#DevOps</span>
            <span className="bg-secondary px-3 py-1 rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors">#CI/CD</span>
          </div>
          {/* Price and Action */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-sm font-medium text-foreground block">Morshedul Munna</span>
                <span className="text-xs text-muted-foreground">Instructor</span>
              </div>
            </div>
            {/* Price */}
            <div className="text-right">
              <p className="text-card-foreground text-xl font-medium">$1200</p>
              <p className="text-xs text-muted-foreground line-through">$1500</p>
            </div>
          </div>
          {/* View Course Button */}
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" className="font-medium text-foreground hover:underline hover:text-blue-600 dark:hover:text-blue-400" asChild>
              <Link href="/course/docker-mastery">View Course →</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
