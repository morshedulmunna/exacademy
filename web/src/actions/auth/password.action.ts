"use server";

import FetchAPI from "@/actions/http";

export async function forgotPasswordAction(params: { email: string }) {
  return FetchAPI.post({ endpoint: "/api/auth/forgot-password", body: params, contentType: "application/json" });
}

export async function resetPasswordAction(params: { email: string; code: string; new_password: string }) {
  return FetchAPI.post({ endpoint: "/api/auth/reset-password", body: params, contentType: "application/json" });
}
