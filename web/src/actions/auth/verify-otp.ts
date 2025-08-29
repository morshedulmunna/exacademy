"use server";

import { API_ENDPOINTS } from "@/configs/api-path";
import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";
import { ResponseType } from "@/lib/types";

/**
 * RegistrationRequest defines the payload for user registration.
 * Fields are aligned with backend API requirements.
 */
type VerifyOtpRequest = {
  email: string;
  otp: string;
};

/**
 * Login server action
 * Calls the login API endpoint with email and password
 * Returns a structured response with success/error information
 */
export async function VerifyOtpAction(data: VerifyOtpRequest): Promise<ResponseType> {
  const { email, otp } = data;

  try {
    const response = await API.post(API_ENDPOINTS.AUTH.VERIFY, {
      email,
      code: otp,
    });

    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}
