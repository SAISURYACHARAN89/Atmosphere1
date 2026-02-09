// ----------------- Format User Data ----------------

import { ZUserSchema } from "@/types/auth";

export function formatUserData(user: ZUserSchema, postCount: number) {
  return {
    username: `@${user?.username}`,
    name: user?.fullName || "",
    avatar: user?.avatarUrl || "",
    bio: user?.bio || "",
    location: user?.location || "",
    stats: {
      followers: user.followersCount ?? 0,
      following: user.followingCount ?? 0,
      postsSaved: 0,
      profileViews: 0,
      posts: postCount || 0,
    },
  };
}
