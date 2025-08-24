"use server";

import FetchAPI from "@/actions/http";

export async function forgotPasswordAction(params: { email: string }) {
  try {
    return FetchAPI.post({ endpoint: "/api/auth/forgot-password", body: params });
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function resetPasswordAction(params: { email: string; code: string; new_password: string }) {
  try {
    return FetchAPI.post({ endpoint: "/api/auth/reset-password", body: params });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
