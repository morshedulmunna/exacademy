import { certificate_image } from "@/assets";
import { HeartHandshake, Timer, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type Props = {
  slug: string;
  price: number;
  duration: string;
  lessons: number;
  originalPrice?: number;
};

export default function CoursePurchaseInfo({ slug, price, duration, lessons, originalPrice }: Props) {
  return (
    <>
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl dark:text-white text-gray-900 font-bold">৳{price}</h1>
          {originalPrice && originalPrice > price ? <span className="text-sm md:text-base text-gray-500 dark:text-gray-400 line-through">৳{originalPrice}</span> : null}
        </div>
      </div>
      <div>
        <p className="text-sm sm:text-base font-normal leading-6 dark:text-gray-200 text-gray-700">
          Includes <strong className="dark:text-white text-gray-900">lifetime access</strong> to current and future updates to the course. Learn at your own pace, anytime.
        </p>

        <Link href={`/course/checkout/${slug}`}>
          <button className="gradient-bg text-base sm:text-lg md:text-xl font-semibold text-white px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-lg mt-4 shadow-sm hover:shadow-md transition-shadow">Buy Now</button>
        </Link>

        {/* <button className="w-full mt-3 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 py-2 px-2 rounded-lg text-sm font-medium dark:text-gray-200 text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
          Apply coupon
        </button> */}
      </div>

      {/* certification */}
      <h6 className="mt-6 mb-2 text-sm sm:text-base dark:text-white text-gray-900 font-semibold">Includes Certificate of Completion</h6>
      <div className="w-full h-[200px] sm:h-[250px] bg-gray-200 dark:bg-gray-600 rounded-lg">
        <Image src={certificate_image} alt="Certificate" className="w-full h-full" />
      </div>
      <p className="text-xs sm:text-sm leading-[18px] mt-2 dark:text-gray-300 text-gray-600">
        Add this credential to your <strong className="dark:text-white text-gray-900">LinkedIn profile</strong>, resume, or CV. You can share it on social media and in your performance review.
      </p>

      <div className="mt-4">
        <h5 className="text-sm sm:text-base font-semibold dark:text-white text-gray-900 mb-3">What's in the course?</h5>

        <div className="flex items-center text-xs sm:text-sm font-medium gap-2 sm:gap-3 mt-3 dark:text-gray-200 text-gray-700">
          <Video size={18} className="sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400" />
          <p>{lessons} video lectures</p>
        </div>
        <div className="flex items-center text-xs sm:text-sm font-medium gap-2 sm:gap-3 mt-3 dark:text-gray-200 text-gray-700">
          <Timer size={18} className="sm:w-5 sm:h-5 text-green-500 dark:text-green-400" />
          <p>{duration} total duration</p>
        </div>
        <div className="flex items-center text-xs sm:text-sm font-medium gap-2 sm:gap-3 mt-3 dark:text-gray-200 text-gray-700">
          <HeartHandshake size={18} className="sm:w-5 sm:h-5 text-red-500 dark:text-red-400" />
          <p>Life time Support!</p>
        </div>
      </div>
    </>
  );
}
