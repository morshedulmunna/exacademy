import BoxWrapper from "@/common/BoxWrapper";
import React from "react";
import { RatingView } from "../RatingView";
import type { CourseReview } from "@/lib/types";

type Props = {
  review?: CourseReview;
};

export default function FeaturesReview({ review }: Props) {
  return (
    <>
      <BoxWrapper className="mt-10 dark:bg-gray-800/50 bg-gray-50 dark:border-gray-700">
        <div className="p-6">
          <h4 className="dark:text-white text-gray-900 font-semibold text-lg mb-4">Featured Review</h4>
          {review ? (
            <>
              <div className="flex mt-4 mb-4 gap-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="dark:text-white text-gray-900 font-medium">{review.user?.name || "Anonymous"}</p>
                </div>
              </div>
              <div className="flex mb-3 items-center gap-2">
                <RatingView ratingPercentage={(Math.max(1, Math.min(5, review.rating)) / 5) * 100} />
                <span className="text-sm dark:text-gray-400 text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed">{review.content}</p>
            </>
          ) : (
            <p className="text-sm dark:text-gray-400 text-gray-500">No featured review yet.</p>
          )}
        </div>
      </BoxWrapper>
    </>
  );
}
