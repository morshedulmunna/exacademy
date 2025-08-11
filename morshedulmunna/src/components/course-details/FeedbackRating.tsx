import React from "react";
import { RatingView } from "../RatingView";

type Props = object;

export default function FeedbackRating({}: Props) {
  return (
    <>
      <div className="mt-6 sm:mt-8 lg:mt-10">
        <h3 className="dark:text-white text-gray-900 font-semibold text-lg sm:text-xl mb-4 sm:mb-6">Student Feedback</h3>

        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <h1 className="text-orange-500 dark:text-orange-400 text-6xl font-bold">4.6</h1>
              <div className="flex justify-center mt-2">
                <RatingView ratingPercentage={23} />
              </div>
              <p className="text-orange-500 dark:text-orange-400 pt-2 font-medium text-base">Course Rating</p>
            </div>

            <div className="w-full space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative flex-1 dark:bg-gray-600 bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div className="absolute top-0 bg-yellow-500 dark:bg-yellow-400 w-1/2 h-3 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2 min-w-[70px]">
                    <RatingView ratingPercentage={45} />
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">75%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tablet and Desktop Layout */}
        <div className="hidden sm:flex w-full items-start gap-6 lg:gap-8">
          <div className="flex-shrink-0">
            <h1 className="text-orange-500 dark:text-orange-400 text-6xl lg:text-7xl font-bold">4.6</h1>
            <div className="mt-2">
              <RatingView ratingPercentage={23} />
            </div>
            <p className="text-orange-500 dark:text-orange-400 pt-2 font-medium text-base">Course Rating</p>
          </div>

          <div className="flex-1 space-y-3 lg:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="relative flex-1 dark:bg-gray-600 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className="absolute top-0 bg-yellow-500 dark:bg-yellow-400 w-1/2 h-3 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2 min-w-[80px] lg:min-w-[90px]">
                  <RatingView ratingPercentage={45} />
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">75%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
