import {z} from "zod"
import {MaintenanceType, MaintenanceResult}from "../../generated/prisma"

export const createMaintenceLogSchema = {
    body: z.object({
        workType: z.nativeEnum(MaintenanceType),
        workResult: z.nativeEnum(MaintenanceResult),
        description: z.string().min(5),
        plannedAt: z.string().datetime().optional()
    })
}

export const updateMaintenceLogSchema = {
    body: createMaintenceLogSchema.body.partial().extend({
        plannedAt: z.string().datetime().nullish()
    })
}

export type CreateMaintenceLogDTO = z.infer<typeof createMaintenceLogSchema.body>
export type UpdateMaintenceLogDTO = z.infer<typeof updateMaintenceLogSchema.body>