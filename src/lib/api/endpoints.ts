
// Authentication related API endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  VERIFY_OTP: "/api/auth/verify-otp",
  RESET_PASSWORD: "/api/auth/reset-password",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESEND_OTP: "/api/auth/resend-otp",
};

export const USER_ENDPOINTS = {
  PROFILE: "/api/profile",

  PROFILE_VISIT: (userId: string) => `/api/profile/${userId}`,

  CHECK_USERNAME: (username: string) =>
    `/api/users/check/${encodeURIComponent(username)}`,

  USER_BY_ID: (id: string) =>
    `/api/users/${encodeURIComponent(id)}`,

  STARTUP_DETAILS: (id: string) =>
    `/api/startup-details/${encodeURIComponent(id)}`,

  STARTUP_DETAILS_BY_ID: (id: string) =>
    `/api/startup-details/by-id/${encodeURIComponent(id)}`,

  UPLOAD: "/api/upload",

  FOLLOW: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}`,

  FOLLOW_CHECK: (id: string) =>
    `/api/follows/check/${encodeURIComponent(id)}`,

  FOLLOWERS: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}/followers`,

  FOLLOWING: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}/following`,

  SEARCH_USERS: "/api/search/users",
};
