import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterDTO } from "./auth_schema";
import { registerService } from "./auth_service";
import {Prisma} from "@prisma/client"

export const registerController = async (
    request: FastifyRequest<{ Body: RegisterDTO }>,
    reply: FastifyReply
) => {
    try {
        const reg = request.body
        const newUser = await registerService(reg)
        return reply.status(201).send(newUser)

    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Email already exist") {
            return reply.status(409).send({ message: error.message })
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return reply.status(409).send({message: "Username or email already exists"})
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }

}