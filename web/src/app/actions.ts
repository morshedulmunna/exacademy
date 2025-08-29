"use server";

import { cookies } from "next/headers";

/**
 * Server-side storage utilities using Next.js cookies API
 * These functions can ONLY be used in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * DO NOT use in client-side code or components with 'use client'
 */

/**
 * Set a cookie with options
 */
// export async function setServerCookie(
//   name: string,
//   value: string,
//   options?: {
//     expires?: Date;
//     maxAge?: number;
//     domain?: string;
//     path?: string;
//     secure?: boolean;
//     httpOnly?: boolean;
//     sameSite?: boolean | "lax" | "strict" | "none";
//     priority?: "low" | "medium" | "high";
//     partitioned?: boolean;
//   }
// ): Promise<void> {
//   try {
//     const cookieStore = await cookies();
//     cookieStore.set(name, value, options);
//   } catch (error) {
//     console.error("Error setting server cookie:", error);
//   }
// }

/**
 * Get a cookie value
 */
export async function getServerCookie(name: string): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value;
  } catch (error) {
    console.error("Error getting server cookie:", error);
    return undefined;
  }
}

/**
 * Get all cookies
 */
export async function getAllServerCookies(): Promise<Array<{ name: string; value: string }>> {
  try {
    const cookieStore = await cookies();
    return cookieStore.getAll().map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
    }));
  } catch (error) {
    console.error("Error getting all server cookies:", error);
    return [];
  }
}

/**
 * Check if a cookie exists
 */
export async function hasServerCookie(name: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.has(name);
  } catch (error) {
    console.error("Error checking server cookie:", error);
    return false;
  }
}

/**
 * Delete a cookie
 */
export async function deleteServerCookie(name: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  } catch (error) {
    console.error("Error deleting server cookie:", error);
  }
}

/**
 * Clear all cookies by deleting them individually
 */
export async function clearAllServerCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Delete each cookie individually since clear() is not available
    for (const cookie of allCookies) {
      cookieStore.delete(cookie.name);
    }
  } catch (error) {
    console.error("Error clearing server cookies:", error);
  }
}

/**
 * Get cookie as string representation
 */
export async function getServerCookiesString(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.toString();
  } catch (error) {
    console.error("Error converting server cookies to string:", error);
    return "";
  }
}

// Note: In "use server" files, only async functions can be exported
// Use named imports: import { setServerCookie, getServerCookie } from '@/lib/server-storages'
