"use server";

import { OkResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";
import { ErrorResponse } from "@/configs/error";
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
    const errorMessage = await ErrorResponse(error);
    throw new Error(errorMessage);
  }
}
