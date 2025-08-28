"use server";

import { RegisterRequest, RegisterResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";
import { ErrorResponse } from "@/configs/error";

/**
 * Server action to register a new user account
 * @param data - User registration data including email, firstName, lastName, password, and username
 * @returns Promise<RegisterResponse> - Response containing the new user's ID
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    console.log("Registering user with data:", data);

    // Call the register endpoint
    const response = await AUTH_API.register({
      registerRequest: data,
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = await ErrorResponse(error);
    throw new Error(errorMessage);
  }
}
