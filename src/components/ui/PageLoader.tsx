"use client";

import { useEffect, useState } from "react";
import { Loading } from "./loading";

/**
 * PageLoader component that shows a full-screen loading animation
 * during initial page load and fades out once the page is ready
 */
export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loader after a minimum time to prevent flash
    const minLoadTime = 800; // 800ms minimum loading time
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        setIsLoading(false);
        // Add a small delay before hiding to ensure smooth transition
        setTimeout(() => setIsVisible(false), 300);
      }, remainingTime);
    };

    // Listen for page load events
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white dark:bg-black transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full">
        {/* Logo or Brand */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Morshedul Islam Munna
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            Software Engineer
          </p>
        </div>

        {/* Loading Spinner */}
        <Loading size="lg" text="Loading..." />

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Tips */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 animate-pulse">
            Preparing your experience...
          </p>
        </div>
      </div>
    </div>
  );
} 