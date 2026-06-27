import { apiClient } from "./api-client";

export type RoleApiItem = {
  Id?: number | string;
  id?: number | string;
  Name?: string;
  name?: string;
  Title?: string;
  title?: string;
  SystemName?: string;
  systemName?: string;
  [key: string]: any;
};

const ROLE_LIST_PATH = process.env.NEXT_PUBLIC_ROLE_LIST_PATH || "/Role/GetRoles";

export const roleService = {
  async getRoles(): Promise<RoleApiItem[] | { Data?: RoleApiItem[]; data?: RoleApiItem[]; items?: RoleApiItem[] }> {
    return apiClient<any>(ROLE_LIST_PATH, {
      method: "GET",
    });
  },
};