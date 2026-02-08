
/* ================= AUth ================= */
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  VERIFY_OTP: "/api/auth/verify-otp",
  RESET_PASSWORD: "/api/auth/reset-password",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESEND_OTP: "/api/auth/resend-otp",
};

/* ================= User ================= */
export const USER_ENDPOINTS = {
  PROFILE: "/api/profile",

  PROFILE_VISIT: (userId: string) => `/api/profile/${userId}`,

  CHECK_USERNAME: (username: string) =>
    `/api/users/check/${encodeURIComponent(username)}`,

  USER_BY_ID: (id: string) =>
    `/api/users/${encodeURIComponent(id)}`,

  STARTUP_DETAILS: (id: string) =>
    `/api/startup-details/${encodeURIComponent(id)}`,

  STARTUP_DETAILS_BY_ID: (id: string) =>
    `/api/startup-details/by-id/${encodeURIComponent(id)}`,

  UPLOAD: "/api/upload",

  FOLLOW: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}`,

  FOLLOW_CHECK: (id: string) =>
    `/api/follows/check/${encodeURIComponent(id)}`,

  FOLLOWERS: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}/followers`,

  FOLLOWING: (id: string) =>
    `/api/follows/${encodeURIComponent(id)}/following`,

  SEARCH_USERS: "/api/search/users",
};


/* ================= Chat ================= */
export const CHAT_ENDPOINTS = {
  // Fetch chats / create chat
  LIST: "/api/chats",

  // Create group chat
  CREATE_GROUP: "/api/chats/create-group",

  // Chat details
  DETAIL: (chatId: string) => `/api/chats/${chatId}`,

  // Send messages
  MESSAGES: (chatId: string) =>
    `/api/messages/${chatId}`,
};


/* ================= POSTS ================= */

export const POST_ENDPOINTS = {
  MY_POSTS: "/api/posts/me",
  POSTS: "/api/posts",
  POST_BY_ID: (postId: string) =>
    `/api/posts/${encodeURIComponent(postId)}`,
};

/* ================= POSTS ================= */
export const REEL_ENDPOINTS = {
  LIST: "/api/reels",
  DETAIL: (id: string) => `/api/reels/${id}`,
  USER_REELS: (userId: string) =>
    `/api/reels/user/${userId}`,

  LIKE: (id: string) => `/api/reels/${id}/like`,

  COMMENTS: (id: string) =>
    `/api/reels/${id}/comments`,
  COMMENT: (id: string) =>
    `/api/reels/comments/${id}`,
  REPLIES: (id: string) =>
    `/api/reels/comments/${id}/replies`,

  SHARE: (id: string) =>
    `/api/reels/${id}/share`,
  SHARE_CHECK: (id: string) =>
    `/api/reels/${id}/share/check`,
};

/* ================= SAVED POSTS ================= */
export const SAVED_ENDPOINTS = {
  SAVE: "/api/saved",
  DELETE: (id: string) => `/api/saved/${id}`,
  CHECK: (id: string) =>
    `/api/saved/check/${id}`,
};



/* ================= LIKES ================= */

export const LIKE_ENDPOINTS = {
  POST_LIKES: (postId: string) =>
    `/api/likes/post/${encodeURIComponent(postId)}`,
};


/* ================= COMMENTS ================= */

export const COMMENT_ENDPOINTS = {
  COMMENTS: (postId: string) =>
    `/api/comments/${encodeURIComponent(postId)}/comments`,

  DELETE_COMMENT: (commentId: string) =>
    `/api/comments/${encodeURIComponent(commentId)}`,

  REPLIES: (commentId: string) =>
    `/api/comments/${encodeURIComponent(commentId)}/replies`,
};


/* ================= CROWNS ================= */

export const CROWN_ENDPOINTS = {
  POST_CROWNS: (postId: string) =>
    `/api/crowns/post/${encodeURIComponent(postId)}`,
};


/* ================= SHARES ================= */

export const SHARE_ENDPOINTS = {
  SHARES: "/api/shares",
  SEND: "/api/shares/send",
  CHECK_SHARE: (postId: string) =>
    `/api/shares/check/${encodeURIComponent(postId)}`,
};


export const NOTIFICATION_ENDPOINTS = {
  LIST: "/api/notifications",
  READ: (id: string) => `/api/notifications/${id}/read`,
  READ_ALL: "/api/notifications/read-all",
};

export const SETTINGS_ENDPOINTS = {
  SETTINGS: "/api/settings",
  PASSWORD: "/api/settings/password",
  KYC: "/api/settings/kyc",
};

export const JOB_ENDPOINTS = {
  LIST: "/api/jobs",
  DETAIL: (id: string) => `/api/jobs/${id}`,
  APPLY: (id: string) => `/api/jobs/${id}/apply`,
  MY_APPLIED: "/api/jobs/my-applied",
  MY_POSTED: "/api/jobs/my-posted",
  APPLICANTS: (id: string) => `/api/jobs/${id}/applicants`,
  EXPORT_APPLICANTS: (id: string) =>
    `/api/jobs/${id}/applicants/export`,
};

export const MISC_ENDPOINTS = {
  GRANTS: "/api/grants",
  EVENTS: "/api/events",
  SEARCH: "/api/search",
};

export const TEAM_ENDPOINTS = {
  LIST: "/api/my-team",
  MEMBER: (id: string) => `/api/my-team/${id}`,
};

export const UPLOAD_ENDPOINTS = {
  IMAGE: "/api/upload",
  DOCUMENT: "/api/upload/document",
  VIDEO: "/api/upload/video",
};

