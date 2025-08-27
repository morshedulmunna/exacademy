"use server";

import { RegisterRequest, RegisterResponse } from "@/api";
import { AUTH_API, ErrorResponse } from "@/configs/API_CLIENT";

/**
 * Server action to register a new user account
 * @param data - User registration data including email, firstName, lastName, password, and username
 * @returns Promise<RegisterResponse> - Response containing the new user's ID
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    // Call the register endpoint
    const response = await AUTH_API.register({
      registerRequest: data,
    });

    return response;
  } catch (error) {
    const errorMessage = await ErrorResponse(error);
    throw new Error(errorMessage);
  }
}
