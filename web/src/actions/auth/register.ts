"use server";

import { RegisterRequest, RegisterResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";

/**
 * Server action to register a new user account
 * @param data - User registration data including email, firstName, lastName, password, and username
 * @returns Promise<RegisterResponse> - Response containing the new user's ID
 * @throws Error if registration fails
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    // Call the register endpoint
    const response = await AUTH_API.register({
      registerRequest: data,
    });

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Registration failed:", error);

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`Registration failed: ${error.message}`);
    }

    throw new Error("Registration failed. Please try again later.");
  }
}
