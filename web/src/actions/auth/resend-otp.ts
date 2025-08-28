"use server";

import { ResendOtpRequest, OkResponse } from "@/api";
import { AUTH_API } from "@/configs/API_CLIENT";
import { ErrorResponse } from "@/configs/error";
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
    const errorMessage = await ErrorResponse(error);
    throw new Error(errorMessage);
  }
}
