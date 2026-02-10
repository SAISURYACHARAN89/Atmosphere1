import { ZNotification } from "@/types/notifications";
import axiosClient from "./axiosClient";
import { NOTIFICATION_ENDPOINTS } from "./endpoints";

interface FetchNotificationsResponse {
  notifications: ZNotification[];
  unreadCount: number;
}

export async function fetchNotifications(limit = 50, skip = 0) {
  const response: FetchNotificationsResponse = await axiosClient.get(
    NOTIFICATION_ENDPOINTS.LIST,
    {
      params: { limit, skip },
    },
  );
  return response;
}

export async function markNotificationRead(notificationId: string) {
  return axiosClient.put(NOTIFICATION_ENDPOINTS.READ(notificationId));
}

export async function markAllNotificationsRead() {
  return axiosClient.put(NOTIFICATION_ENDPOINTS.READ_ALL);
}
