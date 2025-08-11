import React from "react";
import ReviewCard from "./ReviewCard";
import type { CourseReview } from "@/lib/types";

type Props = {
  reviews?: CourseReview[];
};

export default function StudentReviews({ reviews = [] }: Props) {
  return (
    <div className="mt-10">
      <h3 className="dark:text-white text-gray-900 font-semibold text-xl mb-6">Reviews</h3>

      {reviews.length > 0 ? (
        <div className="space-y-8">
          {reviews.slice(0, 3).map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      ) : (
        <p className="text-sm dark:text-gray-400 text-gray-500">No reviews yet.</p>
      )}

      <p className="text-sm text-center hover:underline transition-all ease-in-out hover:text-cyan-500 cursor-pointer text-gray-500">See More Reviews</p>
    </div>
  );
}
