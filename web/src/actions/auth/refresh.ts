"use server";

import { RefreshRequest, TokenResponse } from "@/api";
import { AUTH_API, ErrorResponse } from "@/configs/API_CLIENT";

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
    const errorMessage = await ErrorResponse(error);
    throw new Error(errorMessage);
  }
}
