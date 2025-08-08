"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/common/MaxWidthWrapper";

type Props = {
  discountPercentage?: string;
  discountText?: string;
  title?: string;
  interactiveKeyword?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

/**
 * Hero1 - A modern programming education hero section
 * Features discount banner, interactive keyword highlighting, and floating tech icons
 */
export default function Hero1({
  discountPercentage = "20%",
  discountText = "Discount For All Course",
  title = "Learn Programming",
  interactiveKeyword = "interactively",
  description = "From zero to job ready: learning paths, interactive courses, projects, exercises and interview preparation.",
  primaryButtonText = "Start Learning",
  secondaryButtonText = "See what's new →",
  onPrimaryClick,
  onSecondaryClick,
}: Props) {
  return (
    <section className="relative mt-10 lg:mt-44 flex items-center justify-center overflow-hidden ">
      {/* Background Grid Pattern */}

      {/* Subtle Glow Effects */}

      <MaxWidthWrapper className="relative z-10">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Main Content */}
          <div className="space-y-8 mb-16">
            {/* Title with Interactive Keyword */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">{title}</h1>
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-magenta-500 bg-clip-text text-transparent animate-pulse">{interactiveKeyword}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">{description}</p>
          </div>

          {/* Responsive CTA Buttons */}
          <div className="mb-20 space-y-4">
            {/* Desktop: Split Button Layout */}
            <div className="hidden md:inline-flex items-center bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
              {/* Left Side - Primary Action */}
              <button onClick={onPrimaryClick} className="flex items-center gap-3 px-8 py-4 bg-transparent hover:bg-white/5 transition-colors duration-300 border-r border-white/10">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-lg">{primaryButtonText}</span>
              </button>

              {/* Right Side - Secondary Action */}
              <button onClick={onSecondaryClick} className="flex items-center gap-2 px-6 py-4 bg-transparent hover:bg-white/5 transition-colors duration-300">
                <span className="text-blue-300 font-medium">{secondaryButtonText}</span>
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile: Stacked Button Layout */}
            <div className="md:hidden space-y-3">
              {/* Primary Button */}
              <button onClick={onPrimaryClick} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 hover:bg-white/5 transition-colors duration-300">
                <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-white font-semibold text-base">{primaryButtonText}</span>
              </button>

              {/* Secondary Button */}
              <button onClick={onSecondaryClick} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-transparent hover:bg-white/5 transition-colors duration-300 rounded-lg">
                <span className="text-blue-300 font-medium text-sm">{secondaryButtonText}</span>
                <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Floating Tech Icons */}
      <div className="absolute inset-0  pointer-events-none">
        {/* React Icon */}
        <div className="absolute bottom-20 left-10 w-16 h-16 border border-white/20 rounded-full flex items-center justify-center opacity-40 animate-float">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: "3s" }}></div>
            <div className="absolute inset-2 border-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}></div>
          </div>
        </div>

        {/* JavaScript Icon */}
        <div className="absolute bottom-32 right-16 w-12 h-12 bg-yellow-400/20 border border-yellow-400/30 rounded-lg flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "1s" }}>
          <span className="text-yellow-400 font-bold text-sm">JS</span>
        </div>

        {/* TypeScript Icon */}
        <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "2s" }}>
          <span className="text-blue-400 font-bold text-sm">TS</span>
        </div>

        {/* AWS Icon */}
        <div className="absolute bottom-24 right-1/3 w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "0.5s" }}>
          <span className="text-orange-400 font-bold text-xs">aws</span>
        </div>

        {/* GitHub Icon */}
        <div className="absolute bottom-16 left-1/3 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "1.5s" }}>
          <svg className="w-6 h-6 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </div>

        {/* Lightning Icon */}
        <div className="absolute bottom-28 left-1/2 w-10 h-10 border border-yellow-400/30 rounded-lg flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "0.8s" }}>
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10h7l-8 13v-9H4l8-13v9z" />
          </svg>
        </div>

        {/* Caret/Arrow Icon */}
        <div className="absolute bottom-12 right-8 w-12 h-12 border border-red-400/30 rounded-lg flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "0.3s" }}>
          <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5z" />
          </svg>
        </div>

        {/* Golang Icon */}
        <div className="absolute bottom-2 left-16 w-8 h-8 bg-cyan-500/20 border border-cyan-500/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "2.2s" }}>
          <span className="text-cyan-400 font-bold text-[8px]">Go</span>
        </div>

        {/* Rust Icon */}
        <div className="absolute bottom-4 right-20 w-6 h-6 bg-orange-500/20 border border-orange-500/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "1.3s" }}>
          <span className="text-orange-400 font-bold text-[8px]">Rust</span>
        </div>

        {/* Python Icon */}
        <div className="absolute bottom-6 right-1/3 w-4 h-4 bg-blue-600/20 border border-blue-600/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "0.7s" }}>
          <span className="text-blue-500 font-bold text-[8px]">Py</span>
        </div>

        {/* Node.js Icon */}
        <div className="absolute bottom-8 left-1/3 w-6 h-6 bg-green-500/20 border border-green-500/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "1.6s" }}>
          <span className="text-green-400 font-bold text-[8px]">Node</span>
        </div>

        {/* Java Icon */}
        <div className="absolute bottom-1 left-1/4 w-4 h-4 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "0.9s" }}>
          <span className="text-red-400 font-bold text-[8px]">Java</span>
        </div>

        {/* C++ Icon */}
        <div className="absolute bottom-10 right-1/4 w-6 h-6 bg-blue-700/20 border border-blue-700/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "2.5s" }}>
          <span className="text-blue-600 font-bold text-[8px]">C++</span>
        </div>

        {/* Scala Icon */}
        <div className="absolute bottom-16 left-20 w-4 h-4 bg-red-700/20 border border-red-700/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "3.1s" }}>
          <span className="text-red-600 font-bold text-[8px]">Scala</span>
        </div>

        {/* Dart Icon */}
        <div className="absolute bottom-18 right-1/4 w-4 h-4 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "1.4s" }}>
          <span className="text-blue-400 font-bold text-[8px]">Dart</span>
        </div>

        {/* Elixir Icon */}
        <div className="absolute bottom-20 left-1/3 w-4 h-4 bg-purple-700/20 border border-purple-700/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "2.1s" }}>
          <span className="text-purple-600 font-bold text-[8px]">Elixir</span>
        </div>

        {/* Haskell Icon */}
        <div className="absolute bottom-22 right-16 w-4 h-4 bg-purple-800/20 border border-purple-800/30 rounded flex items-center justify-center opacity-40 animate-float" style={{ animationDelay: "0.6s" }}>
          <span className="text-purple-700 font-bold text-[8px]">Haskell</span>
        </div>
      </div>

      {/* Custom Animation for Floating */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
