"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * RouteLoader component for handling route transitions
 * Shows a subtle loading indicator during navigation
 */
export function RouteLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading on route change
    setIsLoading(true);

    // Hide loading after a short delay to simulate route transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse">
      <div className="h-full bg-white/20 animate-pulse" />
    </div>
  );
}

/**
 * FullScreenRouteLoader for major route transitions
 * Shows a more prominent loading screen for significant navigation
 * Uses CSS-only theme detection to prevent flash between light/dark modes
 */
export function FullScreenRouteLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9997] backdrop-blur-sm flex items-center justify-center" style={{ backgroundColor: "hsl(var(--background) / 0.8)" }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
