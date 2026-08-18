import { FastifyInstance, FastifyRequest } from "fastify";
import { createLogController, updateLogController, deleteLogController, getLogByIdController, getLogsByDeviceController } from "./maintenance_contrloller";
import { createMaintenceLogSchema, updateMaintenceLogSchema } from "./maintenance_schema";
import { CreateMaintenceLogDTO, UpdateMaintenceLogDTO } from "./maintenance_schema"
import { authenticate } from "../auth/auth_guard";


export const logRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/devices/:deviceId/maintenance-logs', {
        preHandler: [
            authenticate as any,
            async (request: FastifyRequest<{ Body: CreateMaintenceLogDTO }>, reply) => {
                const result = createMaintenceLogSchema.body.safeParse(request.body)
                if (!result.success) {
                    return reply.status(400).send({
                        message: "Create log failed",
                        errors: result.error.issues
                    })
                }
                request.body = result.data
            }
        ]
    }, createLogController as any)
    fastify.get('/devices/:deviceId/maintenance-logs', { preHandler: [authenticate] }, getLogsByDeviceController as any)
    fastify.get('/maintenance-logs/:id', {preHandler: [authenticate]}, getLogByIdController as  any)
    fastify.patch('/maintenance-logs/:id', {preHandler: [authenticate,
        async(request: FastifyRequest<{Body: UpdateMaintenceLogDTO}>, reply) => {
            const result = updateMaintenceLogSchema.body.safeParse(request.body)
            if(!result.success) {
                return reply.status(400).send({
                    message: "Update log failed",
                    error: result.error.issues
                })
            } 
            request.body = result.data
        }
    ]}, updateLogController as any)
    fastify.delete('/maintenance-logs/:id', {preHandler: [authenticate]}, deleteLogController as any)
}

