import prisma from "../../lib/prisma";
import { CreateWebHookDTO, UpdateWebHookDTO } from "./webhook_schema";

export const createWebHook = async (
  data: CreateWebHookDTO,
  organizationId: string,
) => {
  return prisma.webhook.create({
    data: {
      ...data,
      organizationId,
    },
  });
};

export const getAll = async (organizationId: string) => {
  return prisma.webhook.findMany({
    where: {
      organizationId,
    },
  });
};

export const updateWebHook = async (
  data: UpdateWebHookDTO,
  id: string,
  organizationId: string,
) => {
  const webhook = await prisma.webhook.findFirst({
    where: {
      id,
      organizationId,
    },
  });
  if (!webhook) {
    throw new Error("Webhook not found");
  }
  return prisma.webhook.update({
    where: { id },
    data: { ...data },
  });
};

export const deleteWebHook = async (id: string, organizationId: string) => {
  const webhook = await prisma.webhook.findFirst({
    where: {
      id,
      organizationId,
    },
  });
  if (!webhook) {
    throw new Error("Webhook not found");
  }
  return prisma.webhook.delete({
    where: { id }
  });
};
