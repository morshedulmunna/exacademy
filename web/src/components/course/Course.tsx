import React from "react";
import Link from "next/link";
import CourseCard from "./CourseCard";
import { getAllCoursesAction } from "@/actions/courses/get-course.action";
// Backend removed; display with no courses

type Props = {
  page?: number;
  perPage?: number;
};

export default async function Course(props: Props) {
 

  const { data: courses, isLoading, error } = await getAllCoursesAction();



  return (
    <>
      {/* Courses */}
      <section className="py-20 ">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Courses</h2>
          <p className="text-muted-foreground mb-16">Explore a selection of courses designed to help you enhance your skills.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {courses?.length === 0 && <p className="text-muted-foreground">No courses available right now.</p>}
            {courses?.map((course: any) => (
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
                instructorName={course.instructorName}
                instructorAvatar={course.instructorAvatar}
                instructorTitle={course.instructorTitle}
                instructorBio={course.instructorBio}
                rating={course.rating}
                reviews={course.reviews}
                isBestseller={course.isBestseller}
                lastUpdated={course.lastUpdated}
                studentsEnrolled={course.studentsEnrolled}
                courseCategory={course.courseCategory}
                difficultyLevel={course.difficultyLevel}
                learningOutcomes={course.learningOutcomes}
              />
            ))}
          </div>
         
        </div>
      </section>
    </>
  );
}
