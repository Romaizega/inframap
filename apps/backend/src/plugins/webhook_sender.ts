import prisma from "../lib/prisma";

export const sendWebhooks = async (organizationId: string, payload: Record<string, unknown>) => {
  const allActiveWebHooks = await prisma.webhook.findMany({
    where: {
      organizationId,
      isActive: true,
      events: { has: "DEVICE_STATUS_CHANGED" },
    },
  });
  for (const webhookone of allActiveWebHooks) {
    try {
      await fetch(webhookone.url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to send webhook", webhookone.url, error)
    }
  }
};
