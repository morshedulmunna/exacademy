"use server";

import { VerifyOtpRequest, OkResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";

/**
 * Server action to verify email with OTP code
 * @param data - Request containing the OTP code and email address
 * @returns Promise<OkResponse> - Response indicating successful OTP verification
 * @throws Error if OTP verification fails
 */
export async function verifyOtp(data: VerifyOtpRequest): Promise<OkResponse> {
  try {
    // Call the verify OTP endpoint
    const response = await AUTH_API.verify({
      verifyOtpRequest: data,
    });

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("OTP verification failed:", error);

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }

    throw new Error("OTP verification failed. Please check your code and try again.");
  }
}
