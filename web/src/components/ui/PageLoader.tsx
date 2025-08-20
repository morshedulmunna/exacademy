"use client";

import { useEffect, useState } from "react";
import { Loading } from "./loading";
import AnimatedGridBackground from "@/common/Effect/animated-grid-background";
import CursorGlow from "@/common/Effect/CursorGlow";
import TechLogosBackground from "@/common/Effect/tech-logos-background";

/**
 * PageLoader component that shows a full-screen loading animation
 * during initial page load and fades out once the page is ready
 * Uses CSS-only theme detection to prevent flash between light/dark modes
 */
export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    // Hide loader after a minimum time to prevent flash
    const minLoadTime = 1000; // 1 second minimum loading time
    const startTime = Date.now();

    // Loading text sequence
    const loadingTexts = ["Initializing...", "Loading assets...", "Preparing interface...", "Almost ready..."];

    let textIndex = 0;
    const textInterval = setInterval(() => {
      if (textIndex < loadingTexts.length - 1) {
        textIndex++;
        setLoadingText(loadingTexts[textIndex]);
      }
    }, 300);

    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        clearInterval(textInterval);
        setLoadingText("Ready!");
        setIsLoading(false);
        // Add a small delay before hiding to ensure smooth transition
        setTimeout(() => setIsVisible(false), 400);
      }, remainingTime);
    };

    // Listen for page load events
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearInterval(textInterval);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] transition-opacity duration-700 ${isLoading ? "opacity-100" : "opacity-0"}`} style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="flex flex-col items-center justify-center h-full">
        <AnimatedGridBackground gridSize={250} gridOpacity={0.3} waveFrequency={1000} waveIntensity={0.55} waveSpeed={0.5} />
        <CursorGlow />
        <TechLogosBackground />
        {/* Logo or Brand */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">Morshedul Islam Munna</h1>
          <p className="text-sm text-center mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            Software Engineer & Full-Stack Developer
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="mb-8">
          <Loading size="lg" text={loadingText} />
        </div>

        {/* Animated Progress Bar */}
        <div className="w-80 h-2 rounded-full overflow-hidden mb-8" style={{ backgroundColor: "hsl(var(--muted))" }}>
          <div
            className={`h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-1000 ${isLoading ? "animate-pulse" : "w-full"}`}
            style={{
              width: isLoading ? "60%" : "100%",
              animation: isLoading ? "progress-pulse 2s ease-in-out infinite" : "none",
            }}
          />
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>

        {/* Loading Tips */}
        <div className="mt-8 text-center max-w-md">
          <p className="text-xs animate-pulse" style={{ color: "hsl(var(--muted-foreground))" }}>
            Crafting digital experiences with precision and passion
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes progress-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
