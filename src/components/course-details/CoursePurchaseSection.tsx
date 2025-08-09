import BoxWrapper from "@/common/BoxWrapper";
import React from "react";
import CoursePreview from "./CoursePreview";
import CoursePurchaseInfo from "./CoursePurchaseInfo";

type Props = {
  videoUrl?: string;
  title?: string;
  slug: string;
  price: number;
  duration: string;
  lessons: number;
  originalPrice?: number;
};

export default function CoursePurchaseSection({ videoUrl, title, slug, price, duration, lessons, originalPrice }: Props) {
  return (
    <>
      <BoxWrapper className="border-none mt-0 lg:-mt-72 dark:bg-gray-800/50 bg-white dark:border-gray-700">
        <div className="h-full w-full">
          <CoursePreview videoUrl={videoUrl} title={title} />
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg dark:text-white text-gray-900 p-4 pt-8">
            <CoursePurchaseInfo slug={slug} price={price} duration={duration} lessons={lessons} originalPrice={originalPrice} />
          </div>
        </div>
      </BoxWrapper>
    </>
  );
}
