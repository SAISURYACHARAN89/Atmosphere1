import { ZSettingsUser } from "@/types/Profile";
import axiosClient from "./axiosClient";
import { SETTINGS_ENDPOINTS } from "./endpoints";
import { ZChangePasswordResponse } from "@/types/misc";

interface SettingsApiRes {
  settings: ZSettingsUser;
  success?: boolean;
  error?: string;
}

async function getSettings() {
  const res: SettingsApiRes = await axiosClient.get(SETTINGS_ENDPOINTS.SETTINGS);
  return res?.settings as ZSettingsUser;
}

async function updateSettings(payload: {
  fullName?: string;
  username?: string;
  phone?: string;
}) {
  const res: SettingsApiRes = await axiosClient.put(SETTINGS_ENDPOINTS.SETTINGS, payload);
  return res;
}


interface ChangePasswordResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

async function changePassword(currentPassword: string, newPassword: string) {
  const res: ZChangePasswordResponse = await axiosClient.put(SETTINGS_ENDPOINTS.PASSWORD, {
    currentPassword,
    newPassword,
  });
  return res;
}

export { getSettings, updateSettings, changePassword };
