import { z } from "zod";
import { zUserSchema } from "./auth";

export const zGetProfileResponse = z.object({
  details: z.unknown(),
  user: zUserSchema,
});


export const zUploadResponseSchema = z.object({
  success: z.boolean(),
  url: z.string().url(),
  key: z.string(),
});

export type ZUploadResponse = z.infer<typeof zUploadResponseSchema>;


export type ZGetProfileResponse = z.infer<typeof zGetProfileResponse>;
