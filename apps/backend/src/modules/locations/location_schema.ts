import { z} from "zod"


export const createLocationSchema = {
    body: z.object({
        site: z.string().min(3),
        building: z.string().min(3).optional(),
        floor: z.string().optional(),
        latitude:z.number().optional(),
        longitude: z.number().optional(),
        accessinstruction: z.string().optional(),
        description: z.string().optional(),
    })
}

export const updateLocationSchema = {
    body: createLocationSchema.body.partial()
}

export type CreateLocationDTO = z.infer<typeof createLocationSchema.body>
export type UpdateLocationDTO = z.infer<typeof updateLocationSchema.body>