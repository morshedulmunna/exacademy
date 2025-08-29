import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate reading time for content
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  // Strip HTML tags and markdown-like syntax before counting
  const plainText = content
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images (markdown)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links (markdown)
    .replace(/[*_`~]/g, ""); // Remove markdown formatting
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extract excerpt from content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/<[^>]+>/g, "") // Remove HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
    .replace(/[*_`~]/g, "") // Remove markdown formatting
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Safely gets a value from localStorage (browser-only)
 */
export const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Safely sets a value in localStorage (browser-only)
 */
export const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail if localStorage is not available
    }
  }
};

/**
 * Safely removes a value from localStorage (browser-only)
 */
export const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail if localStorage is not available
    }
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  return formatDate(date);
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return !error?.response && error?.request;
}

/**
 * Extracts error message from various error types
 * @param error - The error object (AxiosError, Error, or any)
 * @returns A user-friendly error message
 */
export function extractErrorMessage(error: any): string {
  // Handle network errors first
  if (isNetworkError(error)) {
    return "Network error: Please check your internet connection";
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

/**
 * Extracts HTTP status code from error
 * @param error - The error object
 * @returns HTTP status code or undefined
 */
export function extractErrorStatus(error: any): number | undefined {
  return error?.response?.status;
}

/**
 * Checks if an error is an Axios error
 * @param error - The error object
 * @returns True if it's an Axios error
 */
export function isAxiosError(error: any): boolean {
  return error?.isAxiosError === true;
}

/**
 * Formats API error for consistent error handling
 * @param error - The error object
 * @returns Formatted error object
 */
export function ErrorObj(error: any) {
  return {
    success: false,
    message: extractErrorMessage(error),
    status: extractErrorStatus(error),
    details: error?.response?.data || error,
    isAxiosError: isAxiosError(error),
  };
}

export function DataObj(data: any) {
  return {
    success: true,
    message: data.data.message,
    status: data.data.status_code,
    data: data.data.data,
  };
}
