import { ZExplorePost, ZFeedItem } from "@/types/Explore";
import axiosClient from "./axiosClient";
import {
  POST_ENDPOINTS,
  LIKE_ENDPOINTS,
  COMMENT_ENDPOINTS,
  CROWN_ENDPOINTS,
  SHARE_ENDPOINTS,
  SAVED_ENDPOINTS,
} from "./endpoints";

interface FetchPostsRes{
  posts: ZFeedItem[]
  count: number
}

/* ---------------- POSTS ---------------- */

export async function fetchMyPosts() {
  return axiosClient.get(POST_ENDPOINTS.MY_POSTS);
}

export async function createPost(payload: {
  content: string;
  media?: { url: string; type: string }[];
  tags?: string[];
}) {
  return axiosClient.post(POST_ENDPOINTS.POSTS, payload);
}

export async function getPostById(postId: string) {
  return axiosClient.get(POST_ENDPOINTS.POST_BY_ID(postId));
}

export async function getPostsByUser(userId: string) {
  return axiosClient.get(POST_ENDPOINTS.POSTS, {
    params: { userId },
  });
}


export async function fetchExplorePosts(limit = 20, skip = 0) {
  const res:FetchPostsRes= await axiosClient.get(POST_ENDPOINTS.POSTS, {
    params: { limit, skip },
  });
  return res;
}

/* ---------------- LIKES ---------------- */

export async function likePost(postId: string) {
  return axiosClient.post(LIKE_ENDPOINTS.POST_LIKES(postId));
}

export async function unlikePost(postId: string) {
  return axiosClient.delete(LIKE_ENDPOINTS.POST_LIKES(postId));
}

export async function getPostLikes(postId: string) {
  return axiosClient.get(LIKE_ENDPOINTS.POST_LIKES(postId));
}

/* ---------------- COMMENTS ---------------- */

export async function addComment(
  postId: string,
  payload: { text: string; parent?: string },
) {
  return axiosClient.post(COMMENT_ENDPOINTS.COMMENTS(postId), payload);
}

export async function getComments(postId: string) {
  return axiosClient.get(COMMENT_ENDPOINTS.COMMENTS(postId));
}

export async function deleteComment(commentId: string) {
  return axiosClient.delete(COMMENT_ENDPOINTS.DELETE_COMMENT(commentId));
}

export async function getCommentReplies(commentId: string) {
  return axiosClient.get(COMMENT_ENDPOINTS.REPLIES(commentId));
}

/* ---------------- CROWNS ---------------- */

export async function crownPost(postId: string) {
  return axiosClient.post(CROWN_ENDPOINTS.POST_CROWNS(postId));
}

export async function uncrownPost(postId: string) {
  return axiosClient.delete(CROWN_ENDPOINTS.POST_CROWNS(postId));
}

export async function getPostCrowns(postId: string) {
  return axiosClient.get(CROWN_ENDPOINTS.POST_CROWNS(postId));
}

/* ---------------- SHARES ---------------- */

export async function sharePost(payload: {
  postId: string;
  userIds?: string[];
}) {
  return axiosClient.post(SHARE_ENDPOINTS.SHARES, payload);
}

export async function checkPostShared(postId: string) {
  return axiosClient.get(SHARE_ENDPOINTS.CHECK_SHARE(postId));
}

/* ---------------- SAVED POSTS ---------------- */

export async function savePost(payload: { postId: string }) {
  return axiosClient.post(SAVED_ENDPOINTS.SAVE, payload);
}

export async function fetchSavedPosts() {
  return axiosClient.get(SAVED_ENDPOINTS.SAVE);
}

export async function unsavePost(savedId: string) {
  return axiosClient.delete(SAVED_ENDPOINTS.DELETE(savedId));
}
