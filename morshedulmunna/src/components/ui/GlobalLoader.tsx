"use client";

import { useLoading } from "@/components/providers/LoadingProvider";
import { Loading } from "./loading";

/**
 * GlobalLoader component that shows loading states
 * triggered by the LoadingProvider context
 */
export function GlobalLoader() {
  const { isLoading, loadingText } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9996] bg-white/90 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <Loading size="lg" text={loadingText} />
        
        {/* Optional: Add a subtle animation */}
        <div className="mt-4">
          <div className="flex space-x-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.6s"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 