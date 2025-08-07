import BoxWrapper from "@/common/BoxWrapper";
import React from "react";
import { RatingView } from "../RatingView";

type Props = object;

export default function CourseCard({}: Props) {
  return (
    <>
      <BoxWrapper className="mt-4 dark:bg-gray-800/50 bg-white dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="w-full">
          <div className="cursor-pointer group">
            <div className="bg-gray-300 dark:bg-gray-600 w-full h-36 rounded-lg group-hover:opacity-90 transition-opacity"></div>
            <h4 className="text-lg dark:text-white text-gray-900 font-medium mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Learn Basic of Web - Internet fundamental</h4>
          </div>

          <div className="mt-3">
            <p className="underline capitalize hover:text-blue-500 dark:hover:text-blue-400 dark:text-gray-300 text-gray-600 font-medium transition-colors cursor-pointer">Habibur Rahman</p>
            <div className="flex items-center gap-2 mt-2">
              <RatingView ratingPercentage={80} />
              <p className="text-orange-500 dark:text-orange-400 font-medium">8k+ ratings</p>
            </div>
          </div>
        </div>
      </BoxWrapper>
    </>
  );
}
