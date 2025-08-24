"use server";

import FetchAPI from "@/actions/http";

export async function verifyEmailAction(params: { email: string; code: string }) {
  try {
    return FetchAPI.post({ endpoint: "/api/auth/verify", body: params });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function resendOtpAction(params: { email: string }) {
  try {
    return FetchAPI.post({ endpoint: "/api/auth/resend-otp", body: params });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
