import { FastifyRequest, FastifyReply } from "fastify";
import { CreateWebHookDTO, UpdateWebHookDTO } from "./webhook_schema";
import {
  createWebHook,
  updateWebHook,
  deleteWebHook,
  getAll,
} from "./webhook_service";

export const createWebHookController = async (
  request: FastifyRequest<{ Body: CreateWebHookDTO }>,
  reply: FastifyReply,
) => {
  try {
    const req = request.body;
    const orgId = request.user.organizationId;
    const newWebHook = await createWebHook(req, orgId);
    return reply.status(201).send(newWebHook);
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
};

export const updaWebHookController = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateWebHookDTO }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const orgId = request.user.organizationId;
    const req = request.body;
    const updateHook = await updateWebHook(req, id, orgId);
    return reply.status(200).send(updateHook);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Webhook not found") {
      return reply.status(404).send({ message: error.message });
    }
    request.log.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
};

export const deleteWebHookController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const orgId = request.user.organizationId;
    const delWebHook = await deleteWebHook(id, orgId);
    return reply.status(200).send({ message: "WebbHook deleted", delWebHook });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "WebHook not found") {
      return reply.status(404).send({ message: error.message });
    }
    request.log.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
};

export const getAllWebsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const orgId = request.user.organizationId;
    const allWebHooks = await getAll(orgId);
    return reply.status(200).send(allWebHooks);
  } catch (error: unknown) {
    request.log.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
};
