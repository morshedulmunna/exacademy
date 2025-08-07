"use client";

import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import React from "react";
import { RatingView } from "../RatingView";
import { useTheme } from "@/themes/ThemeProvider";

type Props = object;

export default function CourseDetailsHeading({}: Props) {
  const { theme } = useTheme();

  return (
    <>
      <MaxWidthWrapper className="flex flex-col lg:flex-row items-center gap-6 pt-16 lg:pb-20">
        <div className={`space-y-3 w-full lg:max-w-[60%] ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <h1 className={`text-3xl lg:text-4xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Learn javaScript Basics</h1>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>JavaScript is the most important technology to learn as a web developer. This is a foundational interactive course in order to start learning JavaScript.</p>

          <div className="flex items-start flex-col md:flex-row justify-start gap-2 md:gap-6">
            <RatingView />
            <p className="text-yellow-500 text-sm">(3k ratings)</p>
            <div className={`px-2 text-sm rounded ${theme === "dark" ? "bg-gray-700/50 text-gray-200" : "bg-gray-100 text-gray-700"}`}>17.9k students enrolled</div>
          </div>
          <button className={`cursor-default py-1 text-xs px-2 rounded-full ${theme === "dark" ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}>Excellent Rating</button>

          <div className="flex items-center justify-start gap-2">
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Course Instructor:</p>
            <p className={`underline transition-all ease-in-out cursor-pointer ${theme === "dark" ? "text-cyan-400 hover:text-cyan-500" : "text-cyan-600 hover:text-cyan-500"}`}>Habibur Rahman</p>
          </div>
        </div>
        <div className={`w-full lg:w-1/2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
      </MaxWidthWrapper>
    </>
  );
}
