import fastify, { FastifyInstance, FastifyRequest } from "fastify";
import { createLocationController, updateLocationController, deleteLocationController, getLocationByIdController, getLocationsController } from "./location_controller";
import { createLocationSchema, updateLocationSchema } from "./location_schema";
import { CreateLocationDTO, UpdateLocationDTO } from "./location_schema";
import { authenticate } from "../auth/auth_guard";

export const locationRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/create-location', {
        preHandler: [
            authenticate as any,
            async (request: FastifyRequest<{ Body: CreateLocationDTO }>, reply) => {
                const result = createLocationSchema.body.safeParse(request.body)
                if (!result.success) {
                    return reply.status(400).send({
                        message: "Create location failed",
                        errors: result.error.issues
                    })
                }
                request.body = result.data
            }
        ]
    }, createLocationController)
    fastify.get('/', { preHandler: [authenticate] }, getLocationsController)
    fastify.get('/:id', { preHandler: [authenticate] }, getLocationByIdController as any)
    fastify.patch('/:id', {
        preHandler: [
            authenticate as any,
            async (request: FastifyRequest<{ Body: UpdateLocationDTO }>, reply) => {
                const result = updateLocationSchema.body.safeParse(request.body)
                if (!result.success) {
                    return reply.status(400).send({
                        message: "Update location failed",
                        errors: result.error.issues
                    })
                }
                request.body = result.data  // ← добавил
            }
        ]
    }, updateLocationController as any)
    fastify.delete('/:id', { preHandler: [authenticate] }, deleteLocationController as any)
}