// Base API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    VERIFY: "/auth/verify",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/update",
    LIST: "/users",
  },
  COURSES: {
    LIST: "/courses",
    DETAIL: "/courses",
    CREATE: "/courses",
    UPDATE: "/courses",
    DELETE: "/courses",
  },
  MODULES: {
    LIST: "/modules",
    DETAIL: "/modules",
  },
  LESSONS: {
    LIST: "/lessons",
    DETAIL: "/lessons",
  },
} as const;
