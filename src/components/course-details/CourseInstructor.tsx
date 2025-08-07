import { BookOpen, Facebook, Gem, Github, Star, Twitter, UsersRound, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = object;

export default function CourseInstructor({}: Props) {
  return (
    <>
      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
        <h3 className="dark:text-white text-gray-900 font-semibold text-xl mb-4">Course Instructor</h3>

        <div className="my-4">
          <h5 className="text-blue-600 dark:text-blue-400 underline font-medium text-lg">Habibur Rahman</h5>
          <p className="text-sm dark:text-gray-300 text-gray-600 mt-1">Building coding courses on codedamn</p>
        </div>

        <div className="flex justify-start gap-6 items-start">
          <div className="w-28 h-28 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0"></div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Star size={16} className="text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm dark:text-gray-200 text-gray-700">4.6 Instructor rating</span>
            </div>
            <div className="flex items-center gap-3">
              <Gem size={16} className="text-purple-500 dark:text-purple-400" />
              <span className="text-sm dark:text-gray-200 text-gray-700">23.4k Ratings</span>
            </div>
            <div className="flex items-center gap-3">
              <UsersRound size={16} className="text-green-500 dark:text-green-400" />
              <span className="text-sm dark:text-gray-200 text-gray-700">228.5k Students</span>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen size={16} className="text-blue-500 dark:text-blue-400" />
              <span className="text-sm dark:text-gray-200 text-gray-700">45 Courses</span>
            </div>
          </div>
        </div>

        <p className="mt-4 dark:text-gray-300 text-gray-600 leading-relaxed">
          Me alongside a team of developers, creators, designers are building the best interactive programming courses here.
          <Link href="/instructor/habibur_rahman">
            <span className="pl-2 text-sm underline text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">View Profile</span>
          </Link>
        </p>

        <div className="mt-4 flex items-center gap-4">
          <Github size={20} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors" />
          <Facebook size={20} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors" />
          <Youtube size={20} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors" />
          <Twitter size={20} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors" />
        </div>
      </div>
    </>
  );
}
