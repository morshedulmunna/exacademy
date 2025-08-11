import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import HomeIcon from "@/assets/svg/HomeIcon";
import BlogIcon from "@/assets/svg/BlogIcon";

export default function NotFound() {
  return (
    <div className="min-h-screen relative">
      {/* Animated Background Elements - moved to back layer */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Decorative Grid Pattern - moved to back layer */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
          {/* Main 404 Display */}
          <div className="relative mb-12">
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 select-none animate-pulse">404</h1>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-500/20 to-red-500/20 blur-xl"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-500"></div>
          </div>

          {/* Error Message */}
          <div className="max-w-lg mb-12 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Oops! Page Not Found</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              <p className="text-gray-300 leading-relaxed text-lg">The page you're looking for seems to have wandered off into the digital void. Don't worry though, we've got plenty of other amazing content waiting for you!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12 relative z-20">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r gradient-bg text-white rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
              <HomeIcon className="w-4 h-4" />
              Go Home
            </Link>

            <Link href="/blog" className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-md font-medium border border-white/20 hover:bg-white/20 transition-all duration-200 hover:scale-105">
              <BlogIcon className="w-4 h-4" />
              Explore Blog
            </Link>
          </div>

          {/* Navigation Hint */}
          <div className="flex items-center gap-3 text-gray-400 text-sm bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            </div>
            <span className="text-gray-300">Use the navigation menu above to explore</span>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
