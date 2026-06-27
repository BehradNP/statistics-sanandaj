import { apiClient, unwrapApiData } from "./api-client";
import type { UserDetail } from "@/types/user";

const USER_DETAIL_PATH = process.env.NEXT_PUBLIC_USER_DETAIL_PATH || "/User/GetCurrentUserDetail";
const USER_EDIT_PATH = process.env.NEXT_PUBLIC_USER_EDIT_PATH || "/User/EditUser";

export const userService = {
  async getCurrentUserDetail(): Promise<UserDetail> {
    const response = await apiClient<any>(USER_DETAIL_PATH, {
      method: "GET",
    });

    return unwrapApiData<UserDetail>(response);
  },

  async editUser(payload: UserDetail): Promise<UserDetail> {
    const response = await apiClient<any>(USER_EDIT_PATH, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return unwrapApiData<UserDetail>(response);
  },
};