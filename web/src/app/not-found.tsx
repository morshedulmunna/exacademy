"use client";

import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import HomeIcon from "@/assets/svg/HomeIcon";
import BlogIcon from "@/assets/svg/BlogIcon";
import { useTheme } from "@/themes/ThemeProvider";

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Elements - moved to back layer */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse ${theme === "dark" ? "bg-purple-500/20" : "bg-blue-500/20"}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${theme === "dark" ? "bg-blue-500/20" : "bg-indigo-500/20"}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500 ${theme === "dark" ? "bg-pink-500/10" : "bg-purple-500/10"}`}></div>
      </div>

      {/* Decorative Grid Pattern - moved to back layer */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${theme === "dark" ? "white" : "black"} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
          {/* Main 404 Display */}
          <div className="relative mb-12">
            <div className="relative">
              <h1 className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text select-none animate-pulse ${theme === "dark" ? "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"}`}>404</h1>
              <div className={`absolute inset-0 blur-xl ${theme === "dark" ? "bg-gradient-to-r from-purple-400/20 via-pink-500/20 to-red-500/20" : "bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20"}`}></div>
            </div>

            {/* Floating Elements */}
            <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full animate-bounce ${theme === "dark" ? "bg-yellow-400" : "bg-amber-400"}`}></div>
            <div className={`absolute -bottom-4 -left-4 w-6 h-6 rounded-full animate-bounce delay-300 ${theme === "dark" ? "bg-green-400" : "bg-emerald-400"}`}></div>
            <div className={`absolute top-1/2 -right-8 w-4 h-4 rounded-full animate-bounce delay-500 ${theme === "dark" ? "bg-blue-400" : "bg-sky-400"}`}></div>
          </div>

          {/* Error Message */}
          <div className="max-w-lg mb-12 space-y-6">
            <div className="space-y-4">
              <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Oops! Page Not Found</h2>
              <div className={`w-24 h-1 mx-auto rounded-full ${theme === "dark" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}></div>
              <p className={`leading-relaxed text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>The page you're looking for seems to have wandered off into the digital void. Don't worry though, we've got plenty of other amazing content waiting for you!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12 relative z-20">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 ${theme === "dark" ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"}`}
            >
              <HomeIcon className="w-4 h-4" />
              Go Home
            </Link>

            <Link
              href="/blog"
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium border transition-all duration-200 hover:scale-105 ${theme === "dark" ? "bg-white/10 text-white border-white/20 hover:bg-white/20" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
            >
              <BlogIcon className="w-4 h-4" />
              Explore Blog
            </Link>
          </div>

          {/* Navigation Hint */}
          <div className={`flex items-center gap-3 text-sm backdrop-blur-sm px-6 py-3 rounded-full border ${theme === "dark" ? "text-gray-400 bg-white/5 border-white/10" : "text-gray-500 bg-gray-50/80 border-gray-200"}`}>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${theme === "dark" ? "bg-purple-400" : "bg-blue-400"}`}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse delay-150 ${theme === "dark" ? "bg-pink-400" : "bg-indigo-400"}`}></div>
              <div className={`w-2 h-2 rounded-full animate-pulse delay-300 ${theme === "dark" ? "bg-blue-400" : "bg-purple-400"}`}></div>
            </div>
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>Use the navigation menu above to explore</span>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
