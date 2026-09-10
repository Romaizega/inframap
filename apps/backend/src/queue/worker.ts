import { Worker } from "bullmq";
import { connection } from "./queue";
import prisma from "../lib/prisma";
import { DeviceStatus } from "../generated/prisma";
import eventBus from "../lib/eventBus";
import { sendWebhooks } from "../plugins/webhook_sender";

const worker = new Worker(
  "device-status",

  async (job) => {
    console.log(`Job started: ${job.name}`);
    const devices = await prisma.device.findMany({
      where: { ip_address: { not: null } },
      include: {
        location: {
          select: {
            organizationId: true,
          },
        },
      },
    });
    console.log(`Found ${devices.length} devices`);

    const results: { deviceId: string; status: DeviceStatus }[] = [];

    for (const device of devices) {
      const pingSuccess = Math.random() > 0.3;
      let newStatus: DeviceStatus;

      if (pingSuccess) {
        newStatus = DeviceStatus.ONLINE;
      } else {
        if (device.status === DeviceStatus.ONLINE) {
          newStatus = DeviceStatus.DEGRADED;
        } else if (device.status === DeviceStatus.DEGRADED) {
          newStatus = DeviceStatus.OFFLINE;
        } else {
          newStatus = DeviceStatus.OFFLINE;
        }
      }
      results.push({ deviceId: device.id, status: newStatus });

      await prisma.device.update({
        where: { id: device.id },
        data: { status: newStatus },
      });
      await sendWebhooks(device.location.organizationId, {
        event: "DEVICE_STATUS_CHANGED",
        deviceId: device.id,
        deviceName: device.name,
        status: newStatus,
        organizationId: device.location.organizationId,
      });
    }
    const onlineStatus = results.filter(
      (s) => s.status === DeviceStatus.ONLINE,
    ).length;
    const offlineStatus = results.filter(
      (s) => s.status === DeviceStatus.OFFLINE,
    ).length;
    const degradedStatus = results.filter(
      (s) => s.status === DeviceStatus.DEGRADED,
    ).length;
    console.log(
      `Results: ONLINE=${onlineStatus}, OFFLINE=${offlineStatus}, DEGRADED=${degradedStatus}`,
    );

    for (const result of results) {
      eventBus.emit("device-status-changed", result);
    }
  },

  { connection },
);

worker.on("completed", (job) => {
  console.log("Success", job.name);
});

worker.on("failed", (job, error) => {
  console.log("Failed", error.message, job?.name);
});
