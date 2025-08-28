"use server";

import { LoginRequest, LoginResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";
import { ErrorResponse } from "@/configs/error";

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
    console.log(response);

    return response;
  } catch (error) {
    const errorMessage = await ErrorResponse(error);
    throw new Error(errorMessage);
  }
}
