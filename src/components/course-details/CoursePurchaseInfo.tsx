import { HeartHandshake, Timer, Video } from "lucide-react";
import React from "react";

type Props = object;

export default function CoursePurchaseInfo({}: Props) {
  return (
    <>
      <h1 className="mb-2 text-4xl dark:text-white text-gray-900 font-bold">৳999</h1>
      <div>
        <p className="font-normal leading-6 dark:text-gray-200 text-gray-700">
          Includes <strong className="dark:text-white text-gray-900">lifetime access</strong> to current and future updates to the course. Learn at your own pace, anytime.
        </p>

        <button className="bg-primary dark:bg-blue-600 text-xl font-semibold hover:bg-primary/90 dark:hover:bg-blue-700 transition-all ease-linear text-white px-4 py-3 w-full rounded-lg mt-4 shadow-sm hover:shadow-md">Buy Now</button>

        <button className="w-full mt-3 hover:text-primary dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 py-2 px-2 rounded-lg text-sm font-medium dark:text-gray-200 text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
          Apply coupon
        </button>
      </div>

      {/* certification */}
      <h6 className="mt-6 mb-2 dark:text-white text-gray-900 font-semibold">Includes Certificate of Completion</h6>
      <div className="w-full h-[250px] bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
      <p className="text-sm leading-[18px] mt-2 dark:text-gray-300 text-gray-600">
        Add this credential to your <strong className="dark:text-white text-gray-900">LinkedIn profile</strong>, resume, or CV. You can share it on social media and in your performance review.
      </p>

      <div className="mt-4">
        <h5 className="font-semibold dark:text-white text-gray-900 mb-3">What's in the course?</h5>

        <div className="flex items-center text-sm font-medium gap-3 mt-3 dark:text-gray-200 text-gray-700">
          <Video size={20} className="text-blue-500 dark:text-blue-400" />
          <p>33 video lectures</p>
        </div>
        <div className="flex items-center text-sm font-medium gap-3 mt-3 dark:text-gray-200 text-gray-700">
          <Timer size={20} className="text-green-500 dark:text-green-400" />
          <p>11h 45m total duration</p>
        </div>
        <div className="flex items-center text-sm font-medium gap-3 mt-3 dark:text-gray-200 text-gray-700">
          <HeartHandshake size={20} className="text-red-500 dark:text-red-400" />
          <p>Life time Support!</p>
        </div>
      </div>
    </>
  );
}
