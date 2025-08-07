import BoxWrapper from "@/common/BoxWrapper";
import React from "react";
import CoursePreview from "./CoursePreview";
import CoursePurchaseInfo from "./CoursePurchaseInfo";

type Props = object;

export default function CoursePurchaseSection({}: Props) {
  return (
    <>
      <BoxWrapper className="border-none mt-0 lg:-mt-72 dark:bg-gray-800/50 bg-white dark:border-gray-700">
        <div className="h-full w-full">
          <CoursePreview />
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg text-background dark:text-white p-4 pt-8">
            <CoursePurchaseInfo />
          </div>
        </div>
      </BoxWrapper>
    </>
  );
}
