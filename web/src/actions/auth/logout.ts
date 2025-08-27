"use server";

import { OkResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";

/**
 * Server action to log out a user (stateless)
 * @returns Promise<OkResponse> - Response indicating successful logout
 * @throws Error if logout fails
 */
export async function logout(): Promise<OkResponse> {
  try {
    // Call the logout endpoint
    const response = await AUTH_API.logout();

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Logout failed:", error);

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }

    throw new Error("Logout failed. Please try again later.");
  }
}
