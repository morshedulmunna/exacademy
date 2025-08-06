"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;
  showFullScreenLoader: (text?: string) => void;
  hideFullScreenLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * LoadingProvider component that provides loading state management
 * throughout the application
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");

  const showFullScreenLoader = (text: string = "Loading...") => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideFullScreenLoader = () => {
    setIsLoading(false);
    setLoadingText("Loading...");
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        loadingText,
        setLoadingText,
        showFullScreenLoader,
        hideFullScreenLoader,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

/**
 * Hook to use the loading context
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
