import axiosClient from "./axiosClient";
import { NOTIFICATION_ENDPOINTS } from "./endpoints";

export async function fetchNotifications(limit = 50, skip = 0) {
  return axiosClient.get(NOTIFICATION_ENDPOINTS.LIST, {
    params: { limit, skip },
  });
}

export async function markNotificationRead(notificationId: string) {
  return axiosClient.put(NOTIFICATION_ENDPOINTS.READ(notificationId));
}

export async function markAllNotificationsRead() {
  return axiosClient.put(NOTIFICATION_ENDPOINTS.READ_ALL);
}
