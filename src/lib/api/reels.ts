import axiosClient from "./axiosClient";
import { REEL_ENDPOINTS, SAVED_ENDPOINTS, UPLOAD_ENDPOINTS } from "./endpoints";

// Fetch reels
export async function fetchReels(limit = 20, skip = 0) {
  return axiosClient.get(REEL_ENDPOINTS.LIST, {
    params: { limit, skip },
  });
}

// Create reel
export async function createReel(payload: unknown) {
  return axiosClient.post(REEL_ENDPOINTS.LIST, payload);
}

// Get reel
export async function getReel(reelId: string) {
  return axiosClient.get(REEL_ENDPOINTS.DETAIL(reelId));
}

// User reels
export async function getUserReels(userId: string, limit = 20, skip = 0) {
  return axiosClient.get(REEL_ENDPOINTS.USER_REELS(userId), {
    params: { limit, skip },
  });
}

// Delete reel
export async function deleteReel(reelId: string) {
  return axiosClient.delete(REEL_ENDPOINTS.DETAIL(reelId));
}

// Like reel
export async function likeReel(reelId: string) {
  return axiosClient.post(REEL_ENDPOINTS.LIKE(reelId));
}

// Unlike reel
export async function unlikeReel(reelId: string) {
  return axiosClient.delete(REEL_ENDPOINTS.LIKE(reelId));
}

// Reel comments
export async function getReelComments(reelId: string, limit = 50, skip = 0) {
  return axiosClient.get(REEL_ENDPOINTS.COMMENTS(reelId), {
    params: { limit, skip },
  });
}

// Add comment
export async function addReelComment(
  reelId: string,
  text: string,
  parent?: string,
) {
  return axiosClient.post(REEL_ENDPOINTS.COMMENTS(reelId), { text, parent });
}

// Delete comment
export async function deleteReelComment(commentId: string) {
  return axiosClient.delete(REEL_ENDPOINTS.COMMENT(commentId));
}

// Comment replies
export async function getReelCommentReplies(commentId: string) {
  return axiosClient.get(REEL_ENDPOINTS.REPLIES(commentId));
}

// Share reel
export async function shareReel(reelId: string, followerIds: string[] = []) {
  return axiosClient.post(REEL_ENDPOINTS.SHARE(reelId), { followerIds });
}

// Update share
export async function updateReelShare(reelId: string, followerIds: string[]) {
  return axiosClient.put(REEL_ENDPOINTS.SHARE(reelId), { followerIds });
}

// Check share
export async function checkReelShared(reelId: string) {
  return axiosClient.get(REEL_ENDPOINTS.SHARE_CHECK(reelId));
}

// Save reel
export async function saveReel(reelId: string) {
  return axiosClient.post(SAVED_ENDPOINTS.SAVE, { postId: reelId });
}

// Unsave reel
export async function unsaveReel(savedId: string) {
  return axiosClient.delete(SAVED_ENDPOINTS.DELETE(savedId));
}

// Check saved
export async function checkReelSaved(reelId: string) {
  return axiosClient.get(`${SAVED_ENDPOINTS.CHECK(reelId)}?type=reel`);
}

// Upload video
export async function uploadVideo(formData: FormData) {
  return axiosClient.post(UPLOAD_ENDPOINTS.VIDEO, formData);
}
