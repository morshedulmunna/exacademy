import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import CourseDescription from "@/components/course-details/CourseDescription";
import CourseDetailsHeading from "@/components/course-details/CourseDetailsHeading";
import CourseInstructor from "@/components/course-details/CourseInstructor";
import CourseOutcomes from "@/components/course-details/CourseOutcomes";
import CoursePurchaseSection from "@/components/course-details/CoursePurchaseSection";
import CourseStructure from "@/components/course-details/CourseStructure";
import FeaturesReview from "@/components/course-details/FeaturesReview";
import FeedbackRating from "@/components/course-details/FeedbackRating";
import MoreCoursesByInstructor from "@/components/course-details/MoreCoursesByInstructor";
import StudentReviews from "@/components/course-details/StudentReviews";
import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Course } from "@/lib/types";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCourse(slug: string): Promise<(Course & { modules?: any[] }) | null> {
  try {
    const hdrs = await headers();
    const host = hdrs.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const apiUrl = `${protocol}://${host}/api/courses/by-slug/${slug}`;

    const response = await fetch(apiUrl, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export default async function CourseDetailsPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return notFound();

  const firstLessonWithVideo = course.modules?.flatMap((m: any) => m.lessons || []).find((l: any) => !!l.videoUrl);
  const videoUrl: string | undefined = firstLessonWithVideo?.videoUrl;

  // derive rating stats from reviews
  const ratings = (course.reviews || []).map((r: any) => r.rating);
  const ratingCount = ratings.length;
  const averageRating = ratingCount > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratingCount : undefined;

  return (
    <>
      <div className=" min-h-screen">
        <CourseDetailsHeading title={course.title} excerpt={course.excerpt} students={course.students} instructorName={course.instructor?.name} ratingCount={ratingCount} averageRating={averageRating} />

        <div className=" pb-12 w-full">
          <MaxWidthWrapper>
            <div className="grid grid-cols-12 gap-2 lg:gap-12">
              <div className="col-span-12 lg:col-span-8 order-2 lg:order-1">
                <CourseOutcomes outcomes={course.outcomes} />
                <CourseStructure lessons={course.lessons} duration={course.duration} modules={course.modules as any} />
                <CourseDescription description={course.description} />
                {course.reviews?.[0] && <FeaturesReview review={course.reviews?.[0]} />}
                {/* <FeedbackRating /> */}
                {course.reviews && course.reviews.length > 0 && <StudentReviews reviews={course.reviews} />}
                <CourseInstructor name={course.instructor?.name} instructor={course.instructor as any} stats={{ averageRating, ratingsCount: ratingCount, studentsCount: course.students }} />
                <MoreCoursesByInstructor instructorName={course.instructor?.name} courses={(course as any).relatedCourses || []} />
              </div>
              <div className="col-span-12 lg:col-span-4 order-1 lg:order-2">
                <div className="sticky top-4">
                  <CoursePurchaseSection videoUrl={videoUrl} title={course.title} slug={course.slug} price={course.price} duration={course.duration} lessons={course.lessons} originalPrice={course.originalPrice || undefined} thumbnail={course.thumbnail} />
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </div>
    </>
  );
}
