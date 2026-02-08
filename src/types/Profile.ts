import { z } from "zod";
import { zUserSchema } from "./auth";

export const zGetProfileResponse = z.object({
  details: z.unknown(),
  user: zUserSchema,
});

export type ZGetProfileResponse = z.infer<typeof zGetProfileResponse>;
