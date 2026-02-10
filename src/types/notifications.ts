import { z } from "zod";
import { zUserSchema } from "./auth";

export const zNotificationPayloadSchema = z
  .object({
    postId: z.string().optional(),
    postContent: z.string().optional(),
  })
  .optional();

export const zNotificationSchema = z.object({
  _id: z.string(),
  user: z.string(),
  actor: zUserSchema,
  type: z.any(),
  payload: zNotificationPayloadSchema,
  isRead: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export type ZNotification = z.infer<typeof zNotificationSchema>;
