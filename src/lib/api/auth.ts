/**
 * Authentication API functions (Web)
 */

import { ZLoginResponse, ZUserSchema } from "@/types/auth";
import axiosClient from "./axiosClient";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "./endpoints";
import Cookies from "js-cookie";

/**
 * Login
 */
export async function login(email: string, password: string) {
  const data: ZLoginResponse = await axiosClient.post(AUTH_ENDPOINTS.LOGIN, {
    email,
    password,
  });

  if (data?.token) {
    Cookies.set("token", data.token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  }

  return data.user;
}

/**
 * Register
 */
export async function register({
  email,
  username,
  password,
  displayName,
  accountType = "personal",
}: {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  accountType?: string;
}) {
  return axiosClient.post(AUTH_ENDPOINTS.REGISTER, {
    email,
    username,
    password,
    displayName,
    accountType,
  });
}

/**
 * Forgot password
 */
export async function forgotPassword(email: string) {
  return axiosClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
}

/**
 * Verify OTP
 */
export async function verifyOtpCheck(email: string, code: string) {
  return axiosClient.post(AUTH_ENDPOINTS.VERIFY_OTP, { email, code });
}

/**
 * Reset password
 */
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
) {
  return axiosClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    email,
    code,
    newPassword,
  });
}

/**
 * Verify email
 */
export async function verifyEmail(code: string, email?: string) {
  return axiosClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { code, email });
}

/**
 * Resend OTP
 */
export async function resendOtp(email: string) {
  return axiosClient.post(AUTH_ENDPOINTS.RESEND_OTP, { email });
}

/**
 * Fetch & store user role
 */
export async function fetchAndStoreUserRole() {
  const data = await axiosClient.get(USER_ENDPOINTS.PROFILE);

  let role = "";

  if (Array.isArray(data?.user?.roles)) role = data.user.roles[0] || "";
  else if (Array.isArray(data?.roles)) role = data.roles[0] || "";
  else role = data?.user?.roles || data?.roles || "";

  if (role) localStorage.setItem("role", role);

  return role;
}
