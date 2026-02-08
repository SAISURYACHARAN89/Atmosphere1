import { z } from "zod";

export const zUserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  username: z.string(),

  roles: z.array(z.string()),
  verified: z.boolean(),

  createdAt: z.string(),

  followersCount: z.number(),
  followingCount: z.number(),

  kycCompleted: z.boolean(),
  portfolioComplete: z.boolean(),
  profileSetupComplete: z.boolean(),

  otpVerified: z.boolean(),
  onboardingStep: z.number(),

  links: z.record(z.any()),
});

export type ZUserSchema = z.infer<typeof zUserSchema>;


export const zLoginResponse = z.object({
  token: z.string().uuid(),
  user: zUserSchema,
});

export type ZLoginResponse = z.infer<typeof zLoginResponse>;
