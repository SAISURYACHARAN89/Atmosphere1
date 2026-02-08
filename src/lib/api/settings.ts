import axiosClient from "./axiosClient";
import { SETTINGS_ENDPOINTS } from "./endpoints";

export async function getSettings() {
  return axiosClient.get(SETTINGS_ENDPOINTS.SETTINGS);
}

export async function updateSettings(payload: {
  displayName?: string;
  username?: string;
  phone?: string;
}) {
  return axiosClient.put(
    SETTINGS_ENDPOINTS.SETTINGS,
    payload
  );
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  return axiosClient.put(SETTINGS_ENDPOINTS.PASSWORD, {
    currentPassword,
    newPassword,
  });
}
