"use server";

import FetchAPI from "@/actions/http";

export async function verifyEmailAction(params: { email: string; code: string }) {
  return FetchAPI.post({ endpoint: "/api/auth/verify", body: params, contentType: "application/json" });
}

export async function resendOtpAction(params: { email: string }) {
  return FetchAPI.post({ endpoint: "/api/auth/resend-otp", body: params, contentType: "application/json" });
}
