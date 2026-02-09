import {  ZCheckUsernameResponse } from "@/types/auth";
import axiosClient from "./axiosClient";
import { USER_ENDPOINTS } from "./endpoints";
import { ZGetProfileResponse, ZUploadResponse } from "@/types/Profile";
import { AxiosResponse } from "axios";

/**
 * Fetch & store user
 */
async function fetchAndStoreUser() {
  const storedUser = localStorage.getItem("user");

  try {
    const data: ZGetProfileResponse = await axiosClient.get(
      USER_ENDPOINTS.PROFILE
    );

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    }

    throw new Error("No user in response");
  } catch (err) {
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    throw err;
  }
}

async function updateProfile(payload: unknown) {
  const res = await axiosClient.put(USER_ENDPOINTS.PROFILE, payload);
  return res as ZGetProfileResponse;
}

async function checkIsUserNameAvailable(username: string) {
  const res = await axiosClient.get(USER_ENDPOINTS.CHECK_USERNAME(username));

  return res as ZCheckUsernameResponse;
}

async function getUserByIdentifier(identifier: string) {
  try {
    const data = await axiosClient.get(USER_ENDPOINTS.USER_BY_ID(identifier));
    return data?.user || null;
  } catch {
    return null;
  }
}

async function recordProfileVisit(userId: string) {
  try {
    await axiosClient.get(USER_ENDPOINTS.PROFILE_VISIT(userId));
  } catch {}
}

async function getStartupProfile(userId: string) {
  try {
    const data = await axiosClient.get(USER_ENDPOINTS.STARTUP_DETAILS(userId));
    if (data?.startupDetails)
      return { user: data.startupDetails.user, details: data.startupDetails };
    return data;
  } catch {
    const data = await axiosClient.get(
      USER_ENDPOINTS.STARTUP_DETAILS_BY_ID(userId),
    );
    if (data?.startupDetails)
      return { user: data.startupDetails.user, details: data.startupDetails };
    return data;
  }
}

async function uploadProfilePicture(formData: FormData) {
  const res = await axiosClient.post(USER_ENDPOINTS.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res as ZUploadResponse;
}

async function followUser(targetId: string) {
  return axiosClient.post(USER_ENDPOINTS.FOLLOW(targetId));
}

async function unfollowUser(targetId: string) {
  return axiosClient.delete(USER_ENDPOINTS.FOLLOW(targetId));
}

async function checkFollowing(targetId: string) {
  return axiosClient.get(USER_ENDPOINTS.FOLLOW_CHECK(targetId));
}

async function getFollowersList(userId: string, limit = 20, skip = 0) {
  return axiosClient.get(USER_ENDPOINTS.FOLLOWERS(userId), {
    params: { limit, skip },
  });
}

async function getFollowingList(userId: string, limit = 20, skip = 0) {
  return axiosClient.get(USER_ENDPOINTS.FOLLOWING(userId), {
    params: { limit, skip },
  });
}

async function searchUsers(
  query: string,
  role?: string,
  limit = 20,
  skip = 0,
) {
  const params: any = { q: query, limit, skip };
  if (role) params.role = role;

  const data = await axiosClient.get(USER_ENDPOINTS.SEARCH_USERS, {
    params,
  });

  return data.users ?? [];
}

export {
  fetchAndStoreUser,
  updateProfile,
  checkIsUserNameAvailable,
  getUserByIdentifier,
  recordProfileVisit,
  getStartupProfile,
  uploadProfilePicture,
  followUser,
  unfollowUser,
  checkFollowing,
  getFollowersList,
  getFollowingList,
  searchUsers,
};
