"use server";

import { VerifyOtpRequest, OkResponse } from "@/api";
import { AUTH_API, ErrorResponse } from "@/configs/API_CLIENT";

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
    const errorMessage = await ErrorResponse(error);
    throw new Error(errorMessage);
  }
}
