import BoxWrapper from "@/common/BoxWrapper";
import React from "react";
import { RatingView } from "../RatingView";

type Props = object;

export default function FeaturesReview({}: Props) {
  return (
    <>
      <BoxWrapper className="mt-10 dark:bg-gray-800/50 bg-gray-50 dark:border-gray-700">
        <div className="p-6">
          <h4 className="dark:text-white text-gray-900 font-semibold text-lg mb-4">Featured Review</h4>
          <div className="flex mt-4 mb-4 gap-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
            <div>
              <p className="dark:text-white text-gray-900 font-medium">Krishna Dhingra</p>
              <p className="text-xs dark:text-gray-400 text-gray-500">@krishnaDhingara</p>
            </div>
          </div>
          <div className="flex mb-3 items-center gap-2">
            <RatingView />
            <span className="text-sm dark:text-gray-400 text-gray-500">Oct 05, 2024</span>
          </div>
          <p className="dark:text-gray-300 text-gray-600 leading-relaxed">There is nothing in the course that you would not like to see. Everything is on point no waste of time The best course that you can find on the internet</p>
        </div>
      </BoxWrapper>
    </>
  );
}
