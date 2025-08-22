import { ServerFetch } from "@/actions/http";

export type VerifyOtpInput = { email: string; code: string };
export type SimpleOk = { ok: boolean };

/**
 * Verify a 6-digit OTP code for a given email.
 * Assumes POST /api/auth/verify accepts { email, code } and returns 200 on success.
 */
export async function verifyOtp(input: VerifyOtpInput): Promise<SimpleOk> {
  const res = await ServerFetch<SimpleOk>("/api/auth/verify", {
    method: "POST",
    body: JSON.stringify({ email: input.email, code: input.code }),
  });
  return res;
}

/**
 * Request a resend of the OTP code to the given email.
 * Assumes POST /api/auth/resend-otp accepts { email } and returns 200 on success.
 */
export async function resendOtp(email: string): Promise<SimpleOk> {
  const res = await ServerFetch<SimpleOk>("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res;
}
