import { z } from "zod";

/* ---------- Media ---------- */
export const zMediaSchema = z.object({
  _id: z.string(),
  url: z.string(),
  type: z.string(), // image | video
  thumbUrl: z.string().optional(),
});

/* ---------- Author ---------- */
export const zAuthorSchema = z
  .object({
    _id: z.string(),
    username: z.string(),
    displayName: z.string().optional(),
    avatarUrl: z.string().optional(),
    verified: z.boolean().optional(),
  })
  .nullable();

/* ---------- Base Content ---------- */
const zBaseContentSchema = z.object({
  _id: z.string(),
  author: zAuthorSchema,
  visibility: z.string(),
  likesCount: z.number(),
  commentsCount: z.number(),
  sharesCount: z.number(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number().optional(),
});

/* ---------- Post ---------- */
export const zPostSchema = zBaseContentSchema.extend({
  type: z.literal("post"),
  content: z.string().optional().default(""),
  media: z.array(zMediaSchema).default([]),
  meta: z
    .object({
      likes: z.number().optional(),
      commentsCount: z.number().optional(),
      postType: z.string().optional(),
    })
    .optional(),
});

/* ---------- Reel ---------- */
export const zReelSchema = zBaseContentSchema.extend({
  type: z.literal("reel"),
  videoUrl: z.string(),
  thumbnailUrl: z.string(),
  caption: z.string().optional().default(""),
  duration: z.number(),
  viewsCount: z.number(),
});

/* ---------- Feed Item ---------- */
export const zFeedItemSchema = z.union([
  zPostSchema,
  zReelSchema,
]);

/* ---------- My Posts Response ---------- */
export const zMyPostsResponseSchema = z.object({
  posts: z.array(zPostSchema),
  count: z.number(),
});

/* ---------- Explore Feed Response ---------- */
export const zExploreFeedResponseSchema = z.array(zFeedItemSchema);

/* ---------- Types ---------- */
export type ZMedia = z.infer<typeof zMediaSchema>;
export type ZAuthor = z.infer<typeof zAuthorSchema>;
export type ZPost = z.infer<typeof zPostSchema>;
export type ZReel = z.infer<typeof zReelSchema>;
export type ZFeedItem = z.infer<typeof zFeedItemSchema>;
export type ZMyPostsResponse = z.infer<typeof zMyPostsResponseSchema>;
export type ZExplorePost = z.infer<
  typeof zExploreFeedResponseSchema
>;
