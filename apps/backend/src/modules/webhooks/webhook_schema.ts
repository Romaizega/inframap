import {z} from "zod";

export const createWebhookSchema = {
  body: z.object({
    url: z.string().url(),
    secret: z.string().optional(),
    isActive: z.boolean().optional(),
    events: z.array(z.string()).min(1),
  })
} 

export const updateWebhookSchema = {
  body: createWebhookSchema.body.partial()
}

export type CreateWebHookDTO = z.infer<typeof createWebhookSchema.body>
export type UpdateWebHookDTO = z.infer<typeof updateWebhookSchema.body>