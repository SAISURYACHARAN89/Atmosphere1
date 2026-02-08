import axiosClient from "./axiosClient";
import { SETTINGS_ENDPOINTS } from "./endpoints";

export async function getKycStatus() {
  return axiosClient.get(SETTINGS_ENDPOINTS.KYC);
}

export async function markKycComplete() {
  return axiosClient.put(SETTINGS_ENDPOINTS.KYC);
}
