"use server";

import { API_ENDPOINTS } from "@/configs/api-path";
import API from "@/configs/api.config";
import { DataObj, ErrorObj } from "@/lib/utils";
import { ResponseType } from "@/lib/types";

/**
 * Login server action
 * Calls the login API endpoint with email and password
 * Returns a structured response with success/error information
 */
export async function getCurrentLogedInUser(): Promise<ResponseType> {
  try {
    const response = await API.get(API_ENDPOINTS.USERS.INFO);

    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}
