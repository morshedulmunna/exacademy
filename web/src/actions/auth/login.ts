"use server";

import { API_ENDPOINTS } from "@/configs/api-path";
import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";

type LoginRequest = {
  email: string;
  password: string;
};

type ResponseType = {
  success: boolean;
  message: string;
  data?: any;
  status?: number;
  details?: any;
  isAxiosError?: boolean;
};

/**
 * Login server action
 * Calls the login API endpoint with email and password
 * Returns a structured response with success/error information
 */
export async function loginAction(data: LoginRequest): Promise<ResponseType> {
  const { email, password } = data;

  try {
    const response = await API.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}
