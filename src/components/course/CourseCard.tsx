import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

type Props = {};

export default function CourseCard({}: Props) {
  return (
    <>
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="h-48 relative bg-muted">{/* <Image src="/docker-course.png" alt="Docker Mastery Course" fill className="object-cover" /> */}</div>
        <div className="p-6 space-y-4 flex flex-col">
          <div>
            <h3 className="text-xl font-bold text-card-foreground">Docker Mastery Course</h3>
            <p className="text-muted-foreground line-clamp-5 text-sm">In this course, you will learn everything you need to know about Docker, a powerful tool for creating, deploying, and managing containerized applications.</p>
          </div>
          <div className="flex flex-1 items-center justify-between pt-4">
            <Button variant="outline" size="sm" className="text-xs">
              View Course
            </Button>

            <p className="text-card-foreground text-xl font-medium">$ 1200</p>
          </div>
        </div>
      </div>
    </>
  );
}
