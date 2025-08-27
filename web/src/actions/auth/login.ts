"use server";

import { LoginRequest, LoginResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";

/**
 * Server action to log in a user and receive access/refresh tokens
 * @param data - User login credentials (email and password)
 * @returns Promise<LoginResponse> - Response containing access token, refresh token, and user data
 * @throws Error if login fails
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    // Call the login endpoint
    const response = await AUTH_API.login({
      loginRequest: data,
    });

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Login failed:", error);

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }

    throw new Error("Login failed. Please check your credentials and try again.");
  }
}
