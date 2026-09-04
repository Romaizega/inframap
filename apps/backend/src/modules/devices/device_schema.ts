import { z } from "zod";
import { DeviceType, DeviceStatus } from "../../generated/prisma";

export const createDeviceSchema = {
  body: z.object({
    name: z.string().min(3),
    type: z.nativeEnum(DeviceType),
    status: z.nativeEnum(DeviceStatus).optional(),
    ip_address: z.string().nullable().optional(),
    mac_address: z.string().nullable().optional(),
    manufacturer: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    serialNumber: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    locationId: z.string().uuid(),
  }),
};

export const updateDeviceSchema = {
  body: createDeviceSchema.body.partial(),
};

export type CreateDeviceDTO = z.infer<typeof createDeviceSchema.body>;
export type UpdateDeviceDTO = z.infer<typeof updateDeviceSchema.body>;
