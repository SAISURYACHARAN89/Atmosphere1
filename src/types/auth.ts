import { z } from "zod";

export const zUserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  username: z.string(),

  roles: z.array(z.string()),
  verified: z.boolean(),
  location: z.string().optional(),
  createdAt: z.string(),
  fullName: z.string(),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  accountType: z.string().optional(),
  followersCount: z.number(),
  followingCount: z.number(),

  kycCompleted: z.boolean(),
  portfolioComplete: z.boolean(),
  profileSetupComplete: z.boolean(),

  otpVerified: z.boolean(),
  onboardingStep: z.number(),

  links: z.record(z.any()),
});

export const zLoginResponse = z.object({
  token: z.string().uuid(),
  user: zUserSchema,
});

export const zCheckUsernameResponseSchema = z.object({
  available: z.boolean(),
});

export const zRegisterResponse = z.object({
  token: z.string(),
  message: z.string(),
  user: zUserSchema,
});

export const zVerifyEmailError = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

export type ZLoginResponse = z.infer<typeof zLoginResponse>;
export type ZUserSchema = z.infer<typeof zUserSchema>;
export type ZCheckUsernameResponse = z.infer<
  typeof zCheckUsernameResponseSchema
>;
export type ZRegisterResponse = z.infer<typeof zRegisterResponse>;
export type ZVerifyEmail = z.infer<typeof zVerifyEmailError>;
