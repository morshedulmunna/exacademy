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

      <p className="text-sm text-center hover:underline transition-all ease-in-out hover:text-cyan-500 cursor-pointer text-gray-500">See More Reviews</p>
    </div>
  );
}
