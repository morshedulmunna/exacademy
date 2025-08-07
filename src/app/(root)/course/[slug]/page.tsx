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

type Props = {};

export default function CourseDetailsPage({}: Props) {
  // Example video URL - you can replace this with actual course data
  const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
  const courseTitle = "Course Preview";

  return (
    <>
      <div className=" min-h-screen">
        <CourseDetailsHeading />

        <div className=" pb-12 w-full">
          <MaxWidthWrapper>
            <div className="grid grid-cols-12 gap-2 lg:gap-12">
              <div className="col-span-12 lg:col-span-8 order-2 lg:order-1">
                <CourseOutcomes />
                <CourseStructure />
                <CourseDescription />
                <FeaturesReview />
                <FeedbackRating />
                <StudentReviews />
                <CourseInstructor />
                <MoreCoursesByInstructor />
              </div>
              <div className="col-span-12 lg:col-span-4 order-1 lg:order-2">
                <div className="sticky top-4">
                  <CoursePurchaseSection videoUrl={videoUrl} title={courseTitle} />
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </div>
    </>
  );
}
