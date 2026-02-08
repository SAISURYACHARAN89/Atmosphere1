import axiosClient from "./axiosClient";
import { CHAT_ENDPOINTS } from "./endpoints";

// Fetch chats
export async function fetchChats(type?: "group" | "private") {
  return axiosClient.get(CHAT_ENDPOINTS.LIST, {
    params: type ? { type } : undefined,
  });
}

// Create group chat
export async function createGroup(payload: {
  name: string;
  description?: string;
  participants: string[];
  type?: string;
  image?: string;
}) {
  return axiosClient.post(
    CHAT_ENDPOINTS.CREATE_GROUP,
    payload
  );
}

// Get chat details
export async function getChatDetails(chatId: string) {
  return axiosClient.get(
    CHAT_ENDPOINTS.DETAIL(chatId)
  );
}

// Create/find chat
export async function createOrFindChat(
  participantId: string
) {
  return axiosClient.post(CHAT_ENDPOINTS.LIST, {
    participantId,
  });
}

// Send message
export async function sendMessage(
  chatId: string,
  content: string
) {
  return axiosClient.post(
    CHAT_ENDPOINTS.MESSAGES(chatId),
    { content }
  );
}
