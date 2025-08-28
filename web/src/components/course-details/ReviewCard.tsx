import React from "react";
import { RatingView } from "../RatingView";
import Avatar from "../Avatar";
import type { CourseReview } from "@/lib/types";

type Props = {
  review: CourseReview;
};

export default function ReviewCard({ review }: Props) {
  return (
    <>
      <div className="mt-6 flex gap-4 justify-start items-start p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
        <Avatar link={review.user?.avatar || "/placeholder-user.jpg"} />
        <div className="flex-1">
          <h5 className="dark:text-white text-sm md:text-base text-gray-900 font-medium mb-2">{review.user?.name || "Anonymous"}</h5>
          <div className="flex gap-2 items-center my-2 justify-start">
            <RatingView ratingPercentage={(Math.max(1, Math.min(5, review.rating)) / 5) * 100} />
            <p className="text-sm dark:text-gray-400 text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</p>
          </div>
          <p className="text-sm dark:text-gray-300 text-gray-600 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </>
  );
}
