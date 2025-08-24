// export const HOST = process.env.NEXT_PUBLIC_CRM_ADMIN_API_URL;

export const HOST = process.env.API_BASE_URL || "http://127.0.0.1:9098";

export const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  search: "",
};
