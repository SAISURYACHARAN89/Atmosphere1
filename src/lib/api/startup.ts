import { ZComment, ZStartup, ZTopStartup } from "@/types/startups";
import axiosClient from "./axiosClient";
import { STARTUP_ENDPOINTS } from "./endpoints";
import { ZGetCommentsRes } from "@/types/misc";

interface FetchStartupResponse {
  startups: ZStartup[];
}

/* ---------------- Posts ---------------- */

export async function fetchStartupPosts(limit = 20, skip = 0) {
  const res: FetchStartupResponse = await axiosClient.get(STARTUP_ENDPOINTS.POSTS, {
    params: { limit, skip },
  });
  return res.startups || [];
}

export async function fetchHottestStartups(limit = 10, week?: number) {
  const params: any = { limit };

  if (week && week >= 1 && week <= 4) {
    params.week = week;
  }

  const res: any = await axiosClient.get(STARTUP_ENDPOINTS.HOTTEST, { params });
  return (res?.startups as ZTopStartup[]) || [];
}

/* ---------------- Likes ---------------- */

export async function likeStartup(startupId: string) {
  return axiosClient.post(STARTUP_ENDPOINTS.LIKE(startupId));
}

export async function unlikeStartup(startupId: string) {
  return axiosClient.delete(STARTUP_ENDPOINTS.LIKE(startupId));
}

export async function getStartupLikes(startupId: string) {
  return axiosClient.get(STARTUP_ENDPOINTS.LIKE(startupId));
}

export async function isStartupLiked(startupId: string) {
  try {
    return axiosClient.get(
      STARTUP_ENDPOINTS.LIKE_CHECK(startupId)
    );
  } catch {
    return false;
  }
}

/* ---------------- Crowns ---------------- */

export async function crownStartup(startupId: string) {
  return axiosClient.post(STARTUP_ENDPOINTS.CROWN(startupId));
}

export async function uncrownStartup(startupId: string) {
  return axiosClient.delete(STARTUP_ENDPOINTS.CROWN(startupId));
}

export async function getStartupCrowns(startupId: string) {
  return axiosClient.get(STARTUP_ENDPOINTS.CROWN(startupId));
}

/* ---------------- Comments ---------------- */

export async function addStartupComment(
  startupId: string,
  text: string,
  parent?: string
) {
  return axiosClient.post(
    STARTUP_ENDPOINTS.COMMENTS(startupId),
    { text, parent }
  );
}

export async function getStartupComments(startupId: string) {
  const res: ZGetCommentsRes = await  axiosClient.get(
    STARTUP_ENDPOINTS.COMMENTS(startupId)
  );
  return res;
}

export async function getStartupCommentReplies(commentId: string) {
  return axiosClient.get(
    STARTUP_ENDPOINTS.COMMENT_REPLIES(commentId)
  );
}

export async function deleteStartupComment(commentId: string) {
  return axiosClient.delete(
    STARTUP_ENDPOINTS.COMMENT_DELETE(commentId)
  );
}

export async function saveStartupProfile(payload: any) {
  return axiosClient.post(
    STARTUP_ENDPOINTS.PROFILE,
    payload
  );
}
