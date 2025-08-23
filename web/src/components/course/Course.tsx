import React from "react";
import CourseCard from "./CourseCard";
import listCourses from "@/actions/courses/list";

type Props = {};

export default async function Course({}: Props) {
  const courses = await listCourses();

  return (
    <>
      {/* Courses */}
      <section className="py-20 ">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Courses</h2>
          <p className="text-muted-foreground mb-16">Explore a selection of courses designed to help you enhance your skills.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 && <p className="text-muted-foreground">No courses available right now.</p>}
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description}
                excerpt={course.excerpt ?? undefined}
                thumbnail={course.thumbnail ?? undefined}
                duration={course.duration}
                lessons={course.lessons}
                price={course.price}
                originalPrice={course.original_price ?? undefined}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
