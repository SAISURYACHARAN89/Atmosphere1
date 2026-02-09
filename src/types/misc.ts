import { z } from "zod";

export const zChangePasswordResponse = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ZChangePasswordResponse = z.infer<typeof zChangePasswordResponse>;
