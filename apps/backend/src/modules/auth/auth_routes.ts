import { FastifyInstance } from "fastify";
import { registerController } from "./auth_controller";
import { registerZodSchema } from "./auth_schema";

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
}