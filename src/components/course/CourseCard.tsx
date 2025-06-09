import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

type Props = {};

export default function CourseCard({}: Props) {
  return (
    <>
      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <div className="h-48 relative">{/* <Image src="/docker-course.png" alt="Docker Mastery Course" fill className="object-cover" /> */}</div>
        <div className="p-6 space-y-4 flex flex-col">
          <div>
            <h3 className="text-xl font-bold">Docker Mastery Course</h3>
            <p className="text-gray-400 line-clamp-5 text-sm">In this course, you will learn everything you need to know about Docker, a powerful tool for creating, deploying, and managing containerized applications.</p>
          </div>
          <div className="flex flex-1 items-center justify-between pt-4">
            <Button variant="outline" size="sm" className="text-xs text-black">
              View Course
            </Button>

            <p className="text-white text-xl font-medium">$ 1200</p>
          </div>
        </div>
      </div>
    </>
  );
}
