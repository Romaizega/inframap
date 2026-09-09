import { FastifyInstance, FastifyRequest } from "fastify";
import {
  createWebHookController,
  updaWebHookController,
  getAllWebsController,
  deleteWebHookController,
} from "./webhook_controller";
import { createWebhookSchema, updateWebhookSchema } from "./webhook_schema";
import { authenticate } from "../auth/auth_guard";
import { CreateWebHookDTO, UpdateWebHookDTO } from "./webhook_schema";

export const webHookRoutes = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: CreateWebHookDTO }>(
    "/",
    {
      preHandler: [
        authenticate,
        async (request, reply) => {
          const result = createWebhookSchema.body.safeParse(request.body);
          if (!result.success) {
            return reply.status(400).send({
              message: "Create webhook failed",
              errors: result.error.issues,
            });
          }
          request.body = result.data;
        },
      ],
    },
    createWebHookController,
  );
  fastify.get("/", { preHandler: [authenticate] }, getAllWebsController);
  fastify.patch(
    "/:id",
    {
      preHandler: [
        authenticate,
        async (request, reply) => {
          const result = updateWebhookSchema.body.safeParse(request.body);
          if (!result.success) {
            return reply.status(400).send({
              message: "Create webhook failed",
              errors: result.error.issues,
            });
          }
          request.body = result.data;
        },
      ],
    },
    updaWebHookController as any,
  );
  fastify.delete(
    "/:id",
    { preHandler: [authenticate] },
    deleteWebHookController as any,
  );
};
