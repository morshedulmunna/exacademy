"use server";

import { API_ENDPOINTS } from "@/configs/api-path";
import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";
import { ResponseType } from "@/lib/types";

/**
 * RegistrationRequest defines the payload for user registration.
 * Fields are aligned with backend API requirements.
 */
type RegistrationRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  username: string;
};

/**
 * Login server action
 * Calls the login API endpoint with email and password
 * Returns a structured response with success/error information
 */
export async function RegistrationAction(data: RegistrationRequest): Promise<ResponseType> {
  const { first_name, last_name, email, password, username } = data;

  try {
    const response = await API.post(API_ENDPOINTS.AUTH.REGISTER, {
      first_name,
      last_name,
      email,
      password,
      username,
    });

    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}
