import {z} from "zod"
import { DeviceType, DeviceStatus } from "../../generated/prisma"

export const createDeviceSchema = {
    body: z.object({
        name: z.string().min(3),
        type: z.nativeEnum(DeviceType),
        status: z.nativeEnum(DeviceStatus).optional(),
        ip_address: z.string().optional(),
        mac_address: z.string().optional(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        description: z.string().optional(),
        locationId: z.string().uuid()
    })
}

export const updateDeviceSchema = {
    body: createDeviceSchema.body.partial()
}

export type CreateDeviceDTO = z.infer<typeof createDeviceSchema.body>
export type UpdateDeviceDTO = z.infer<typeof updateDeviceSchema.body>