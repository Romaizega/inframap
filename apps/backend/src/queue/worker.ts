import { Worker } from "bullmq";
import { connection } from "./queue";
import prisma from "../lib/prisma";
import { DeviceStatus } from "../generated/prisma";

new Worker(
    'device-status',

    async (job) => {
        const devices = await prisma.device.findMany({
            where: { ip_address: { not: null } }
        });

        for (const device of devices) {
            const isOnline = Math.random() > 0.3;

            await prisma.device.update({
                where: { id: device.id },
                data: {
                    status: isOnline
                        ? DeviceStatus.ONLINE
                        : DeviceStatus.OFFLINE
                }
            });
        }
    },

    { connection }
)