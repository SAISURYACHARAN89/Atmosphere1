// ----------------- Format User Data ----------------

import { ZUserSchema } from "@/types/auth";

export function formatUserData(user: ZUserSchema) {
  return {
    name: user?.username || "",
    username: `@${user?.username}`,
    avatar: "", // fallback avatar
    bio: "",
    location: "",
    stats: {
      followers: user.followersCount ?? 0,
      following: user.followingCount ?? 0,
      postsSaved: 0,
      profileViews: 0,
      posts: 0,
    },
  };
}
