import RightMarkSvgIcon from "@/assets/svg/RightMarkSvgIcon";
import BoxWrapper from "@/common/BoxWrapper";
import React from "react";

type Props = object;

export default function CourseOutcomes({}: Props) {
  return (
    <BoxWrapper className="mt-6 dark:bg-gray-800/50 bg-white dark:border-gray-700">
      <div className="p-4">
        <h4 className="dark:text-white text-gray-900 font-semibold text-lg">Course Outcomes:</h4>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: 1,
              name: "Go from a total beginner to someone who understands JavaScript",
            },
            {
              id: 2,
              name: "Programming fundamentals: variables, conditionals, data structures",
            },
            {
              id: 3,
              name: "Learn modern JavaScript: ES6, ES7, ES8, ES9, ES10",
            },
            {
              id: 4,
              name: "Understand how JavaScript works behind the scenes",
            },
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <RightMarkSvgIcon />
              </div>
              <p className="dark:text-gray-200 text-gray-700 leading-relaxed">{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </BoxWrapper>
  );
}
