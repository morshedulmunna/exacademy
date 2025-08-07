import BoxWrapper from "@/common/BoxWrapper";
import React from "react";

type Props = object;

export default function CourseStructure({}: Props) {
  return (
    <>
      <div className="mt-8">
        <h3 className="font-bold dark:text-white text-gray-900 text-xl">Course Structure:</h3>
        <div className="flex items-center mt-2 gap-2">
          <p className="dark:text-gray-300 text-gray-600">51 lecture</p>
          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          <p className="dark:text-gray-300 text-gray-600">4h 12m total duration</p>
        </div>

        <BoxWrapper className="mt-8 dark:bg-gray-800/50 bg-gray-50 dark:border-gray-700">
          <div className="p-4 dark:text-gray-200 text-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium">Course Content</span>
              <span className="text-sm dark:text-gray-400 text-gray-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Expand all</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="dark:text-gray-200 text-gray-700">Introduction to JavaScript</span>
                </div>
                <span className="text-sm dark:text-gray-400 text-gray-500">15 min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="dark:text-gray-200 text-gray-700">Variables and Data Types</span>
                </div>
                <span className="text-sm dark:text-gray-400 text-gray-500">25 min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700/50 rounded-lg border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="dark:text-gray-200 text-gray-700">Control Flow</span>
                </div>
                <span className="text-sm dark:text-gray-400 text-gray-500">30 min</span>
              </div>
            </div>
          </div>
        </BoxWrapper>
      </div>
    </>
  );
}
