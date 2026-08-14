import { FastifyInstance, FastifyRequest } from "fastify";
import { createDeviceController, updateDeviceController, getDevicesController, getDeviceByIdController, deleteDeviceController } from "./device_controller";
import { createDeviceSchema, updateDeviceSchema } from './device_schema'
import { authenticate } from "../auth/auth_guard";
import { CreateDeviceDTO, UpdateDeviceDTO } from "./device_schema";


export const deviceRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/create-device', {
        preHandler: [
            authenticate as any,
            async (request: FastifyRequest<{ Body: CreateDeviceDTO }>, reply) => {
                const result = createDeviceSchema.body.safeParse(request.body)
                if (!result.success) {
                    return reply.status(400).send({
                        message: "Create device failed",
                        errors: result.error.issues
                    })
                }
                request.body = result.data
            }
        ]
    }, createDeviceController)
    fastify.get('/', { preHandler: [authenticate] }, getDevicesController)
    fastify.get('/:id', { preHandler: [authenticate] }, getDeviceByIdController as any)
    fastify.patch('/:id', {
        preHandler: [
            authenticate as any,
            async (request: FastifyRequest<{ Body: UpdateDeviceDTO }>, reply) => {
                const result = updateDeviceSchema.body.safeParse(request.body)
                if (!result.success) {
                    return reply.status(400).send({
                        message: "Update device failed",
                        errors: result.error.issues
                    })
                }
                request.body = result.data
            }
        ]
    }, updateDeviceController as any)
    fastify.delete('/:id', { preHandler: [authenticate] }, deleteDeviceController as any)
}
