import { Queue } from "bullmq";

export const connection = {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: 6379
}

export const deviceStatusQueue = new Queue (
    'device-status', {connection})
