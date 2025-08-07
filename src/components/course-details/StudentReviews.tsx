import React from "react";
import ReviewCard from "./ReviewCard";

type Props = object;

export default function StudentReviews({}: Props) {
  return (
    <div className="mt-10">
      <h3 className="dark:text-white text-gray-900 font-semibold text-xl mb-6">Reviews</h3>

      <div className="space-y-8">
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </div>

      <button type="button" className="flex mt-8 h-12 font-semibold hover:bg-orange-500/80 dark:hover:bg-orange-400/80 transition-all ease-in-out items-center justify-center gap-2 w-full bg-orange-500 dark:bg-orange-400 text-white rounded-lg shadow-sm hover:shadow-md">
        <span>See More Reviews</span>
      </button>
    </div>
  );
}
