import { FastifyInstance } from "fastify";
import { registerController, loginController, getMeController } from "./auth_controller";
import { registerZodSchema, loginZodSchema } from "./auth_schema";
import { authenticate } from "./auth_guard";

export const authRoutes = async (fastify: FastifyInstance) => {
    fastify.post('/register', {
        preHandler: async (request, reply) => {
            const result = registerZodSchema.body.safeParse(request.body)
            if (!result.success) {
                return reply.status(400).send({
                    message: "Validation error",
                    errors: result.error.issues
                })
            }
            request.body = result.data
        }

    }, registerController)

    fastify.post('/login', {
        preHandler: async (request, reply) => {
            const result = loginZodSchema.body.safeParse(request.body)
            if (!result.success) {
                return reply.status(400).send({
                    message: "Login error",
                    errors: result.error.issues
                })
            }
            request.body = result.data
        }
    }, loginController)
    fastify.get('/me', { preHandler: [authenticate] }, getMeController)
}