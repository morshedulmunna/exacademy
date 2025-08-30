"use server";

import { API_ENDPOINTS } from "@/configs/api-path";
import API from "@/configs/api.config";
import { ResponseType } from "@/lib/types";
import { DataObj, ErrorObj } from "@/lib/utils";

/**
 * Logout server action
 * Calls the logout endpoint; stateless on server side
 */
export async function logoutAction(): Promise<ResponseType> {
  try {
    const response = await API.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    return DataObj(response) as any;
  } catch (error) {
    return ErrorObj(error) as ResponseType;
  }
}
