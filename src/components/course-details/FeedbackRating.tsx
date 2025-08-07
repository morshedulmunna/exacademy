import React from "react";
import { RatingView } from "../RatingView";

type Props = object;

export default function FeedbackRating({}: Props) {
  return (
    <>
      <div className="mt-10">
        <h3 className="dark:text-white text-gray-900 font-semibold text-xl mb-4">Student Feedback</h3>
        <div className="flex w-full items-center gap-6 mt-4">
          <div className="w-fit">
            <h1 className="text-orange-500 dark:text-orange-400 text-7xl font-bold">4.6</h1>
            <RatingView ratingPercentage={23} />
            <p className="text-orange-500 dark:text-orange-400 whitespace-nowrap pt-2 font-medium">Course Rating</p>
          </div>

          <div className="w-full lg:w-1/2 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative w-full dark:bg-gray-600 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="absolute top-0 bg-yellow-500 dark:bg-yellow-400 w-1/2 h-3 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 min-w-[80px]">
                  <RatingView ratingPercentage={45} />
                  <p className="text-primary dark:text-blue-400 font-medium text-sm">75%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
