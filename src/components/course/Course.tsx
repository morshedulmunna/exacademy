import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import CourseCard from "./CourseCard";

type Props = {};

export default function Course({}: Props) {
  return (
    <>
      {/* Courses */}
      <section className="py-20 ">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Courses</h2>
          <p className="text-muted-foreground mb-16">Explore a selection of courses designed to help you enhance your skills.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course 1 */}
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />
            <CourseCard />

            {/* --- */}
          </div>
        </div>
      </section>
    </>
  );
}
