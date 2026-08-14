import { FastifyReply, FastifyRequest } from "fastify";

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {id:string; email: string; role: string, organizationId:string}
        user: {id:string; email: string; role: string, organizationId: string}
    }
}

export const authenticate = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        await request.jwtVerify()
    } catch (error) {
        return reply.status(401).send({message: "Unauthorized"})
    }
}