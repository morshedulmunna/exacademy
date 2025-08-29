// Base API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    REFRESH: "/api/auth/refresh",
    LOGOUT: "/api/auth/logout",
    VERIFY: "/api/auth/verify",
    RESEND_OTP: "/api/auth/resend-otp",
  },
  USERS: {
    PROFILE: "/api/users/profile",
    UPDATE: "/api/users/update",
    LIST: "/api/users",
  },
  COURSES: {
    LIST: "/api/courses",
    DETAIL: "/api/courses",
    CREATE: "/api/courses",
    UPDATE: "/api/courses",
    DELETE: "/api/courses",
  },
  MODULES: {
    LIST: "/api/modules",
    DETAIL: "/api/modules",
  },
  LESSONS: {
    LIST: "/api/lessons",
    DETAIL: "/api/lessons",
  },
} as const;
