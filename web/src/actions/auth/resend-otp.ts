"use server";

import { API_ENDPOINTS } from "@/configs/api-path";
import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";
import { ResponseType } from "@/lib/types";

/**
 * ResendOtpRequest defines the payload for resending OTP.
 * Fields are aligned with backend API requirements.
 */
type ResendOtpRequest = {
  email: string;
};

/**
 * Resend OTP server action
 * Calls the resend OTP API endpoint with email
 * Returns a structured response with success/error information
 */
export async function ResendOtpAction(data: ResendOtpRequest): Promise<ResponseType> {
  const { email } = data;

  try {
    const response = await API.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
      email,
    });

    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}
