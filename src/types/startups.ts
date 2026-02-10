import { z } from "zod";

/* ---------- Stats ---------- */
export const zStartupStats = z.object({
  likes: z.number(),
  comments: z.number(),
  crowns: z.number(),
  shares: z.number(),
});

/* ---------- Financial Profile ---------- */
export const zFinancialProfile = z.object({
  stages: z.array(z.string()),
  revenueType: z.string(),
  fundingMethod: z.string(),
  fundingAmount: z.number().nullable(),
});

/* ---------- Funding Round ---------- */
export const zStartupRound = z.record(z.any());

/* ---------- Startup ---------- */
export const zStartup = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  verified: z.boolean(),

  profileImage: z.string().nullable(),
  video: z.string().nullable(),

  description: z.string(),

  stage: z.string(),
  currentRound: z.string(),

  financialProfile: zFinancialProfile,

  revenueType: z.string(),
  rounds: z.number(),

  age: z.number(),

  fundingRaised: z.number(),
  fundingNeeded: z.number(),

  fundingRounds: z.array(zStartupRound),
  totalRaisedAll: z.number(),

  stats: zStartupStats,

  likedByCurrentUser: z.boolean(),
  crownedByCurrentUser: z.boolean(),

  isFollowing: z.boolean(),

  isSaved: z.boolean(),
  savedId: z.string().nullable(),
});




export const zAuthorSchema = z.object({
  _id: z.string(),
  username: z.string(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const zCommentSchema = z.object({
  _id: z.string(),
  startup: z.string(),
  author: zAuthorSchema,
  text: z.string().nullable(),
  parent: z.string().nullable(),
  likesCount: z.number(),
  createdAt: z.string(), // or z.coerce.date()
  updatedAt: z.string(), // or z.coerce.date()
  __v: z.number(),
});

/* ---------- comments ---------- */
export type ZComment = z.infer<typeof zCommentSchema>;


/* ---------- List ---------- */
export const zStartupList = z.array(zStartup);

/* ---------- Types ---------- */
export type ZStartup = z.infer<typeof zStartup>;
export type ZStartupStats = z.infer<typeof zStartupStats>;
export type ZFinancialProfile = z.infer<typeof zFinancialProfile>;
