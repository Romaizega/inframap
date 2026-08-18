import { FastifyRequest, FastifyReply } from "fastify";
import { CreateMaintenceLogDTO, UpdateMaintenceLogDTO } from "./maintenance_schema";
import { createLog, updateLog, getLogById, getLogsByDevice, deleteLog } from "./maintenance_service";

export const createLogController = async (
    request: FastifyRequest<{ Params: { deviceId: string }, Body: CreateMaintenceLogDTO }>,
    reply: FastifyReply
) => {
    try {
        const req = request.body
        const { deviceId } = request.params
        const { id, organizationId } = request.user
        const newLog = await createLog(req, deviceId, id, organizationId)
        return reply.status(201).send(newLog)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Device not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })

    }
}
export const getLogsByDeviceController = async (
    request: FastifyRequest<{ Params: { deviceId: string } }>,
    reply: FastifyReply
) => {
    try {
        const { deviceId } = request.params
        const { organizationId } = request.user
        const logs = await getLogsByDevice(deviceId, organizationId)
        return reply.status(200).send(logs)
    } catch (error: unknown) {
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const getLogByIdController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const { organizationId } = request.user
        const logById = await getLogById(id, organizationId)
        if(!logById) {
            return reply.status(404).send({message: "Log not found"})
        }
        return reply.status(200).send(logById)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Log not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const updateLogController = async (
    request: FastifyRequest<{ Params: { id: string }, Body: UpdateMaintenceLogDTO }>,
    reply: FastifyReply
) => {
    try {
        const req = request.body
        const { id } = request.params
        const { organizationId } = request.user
        const updateOldLog = await updateLog(req, id, organizationId)
        return reply.status(200).send(updateOldLog)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Log not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const deleteLogController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const { organizationId } = request.user
        const delLog = await deleteLog(id, organizationId)
        return reply.status(200).send({ message: "Log deleted" })
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Log not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}