import RightMarkSvgIcon from "@/assets/svg/RightMarkSvgIcon";
import BoxWrapper from "@/common/BoxWrapper";
import React from "react";

type Props = {
  outcomes?: string[];
};

export default function CourseOutcomes({ outcomes = [] }: Props) {
  return (
    <BoxWrapper className="mt-6 dark:bg-gray-800/50 bg-white dark:border-gray-700">
      <div className="p-4">
        <h4 className="dark:text-white text-gray-900 font-semibold text-lg">Course Outcomes:</h4>
        {outcomes.length > 0 ? (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {outcomes.map((text, index) => (
              <li key={index} className="flex items-start gap-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <RightMarkSvgIcon />
                </div>
                <p className="dark:text-gray-200 text-gray-700 leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm dark:text-gray-400 text-gray-500">Outcomes will be added soon.</p>
        )}
      </div>
    </BoxWrapper>
  );
}
