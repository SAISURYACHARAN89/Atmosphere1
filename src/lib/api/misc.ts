import axiosClient from "./axiosClient";
import {
  MISC_ENDPOINTS,
  SHARE_ENDPOINTS,
  TEAM_ENDPOINTS,
  UPLOAD_ENDPOINTS,
} from "./endpoints";

// Share content
export async function shareContent(payload: unknown) {
  return axiosClient.post(SHARE_ENDPOINTS.SEND, payload);
}

// Upload image
export async function uploadImage(formData: FormData) {
  return axiosClient.post(UPLOAD_ENDPOINTS.IMAGE, formData);
}

// Upload document
export async function uploadDocument(formData: FormData) {
  return axiosClient.post(UPLOAD_ENDPOINTS.DOCUMENT, formData);
}

// Upload video
export async function uploadVideoFile(formData: FormData) {
  return axiosClient.post(UPLOAD_ENDPOINTS.VIDEO, formData);
}

// Fetch team
export async function fetchMyTeam() {
  return axiosClient.get(TEAM_ENDPOINTS.LIST);
}

// Add team member
export async function addToMyTeam(memberId: string) {
  return axiosClient.post(TEAM_ENDPOINTS.LIST, { memberId });
}

// Remove team member
export async function removeFromMyTeam(memberId: string) {
  return axiosClient.delete(
    TEAM_ENDPOINTS.MEMBER(memberId)
  );
}

// Search entities
export async function searchEntities(
  query: string,
  type = "all",
  limit = 20,
  skip = 0
) {
  return axiosClient.get(MISC_ENDPOINTS.SEARCH, {
    params: { q: query, type, limit, skip },
  });
}

// Fetch grants
export async function fetchGrants(limit = 20, skip = 0) {
  return axiosClient.get(MISC_ENDPOINTS.GRANTS, {
    params: { limit, skip },
  });
}

// Fetch events
export async function fetchEvents(limit = 20, skip = 0) {
  return axiosClient.get(MISC_ENDPOINTS.EVENTS, {
    params: { limit, skip },
  });
}
