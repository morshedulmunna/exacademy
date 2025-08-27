"use server";

import { RefreshRequest, TokenResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";

/**
 * Server action to exchange refresh token for new access token
 * @param data - Refresh token request containing the refresh token
 * @returns Promise<TokenResponse> - Response containing new access and refresh tokens
 * @throws Error if token refresh fails
 */
export async function refresh(data: RefreshRequest): Promise<TokenResponse> {
  try {
    // Call the refresh endpoint
    const response = await AUTH_API.refresh({
      refreshRequest: data,
    });

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Token refresh failed:", error);

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }

    throw new Error("Token refresh failed. Please log in again.");
  }
}
