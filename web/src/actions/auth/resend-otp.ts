"use server";

import { ResendOtpRequest, OkResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";

/**
 * Server action to resend OTP email to a user
 * @param data - Request containing the user's email address
 * @returns Promise<OkResponse> - Response indicating successful OTP resend
 * @throws Error if OTP resend fails
 */
export async function resendOtp(data: ResendOtpRequest): Promise<OkResponse> {
  try {
    // Call the resend OTP endpoint
    const response = await AUTH_API.resendOtp({
      resendOtpRequest: data,
    });

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("OTP resend failed:", error);

    // Re-throw with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`OTP resend failed: ${error.message}`);
    }

    throw new Error("OTP resend failed. Please try again later.");
  }
}
