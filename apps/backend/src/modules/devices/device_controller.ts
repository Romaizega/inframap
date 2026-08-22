import { FastifyRequest, FastifyReply } from "fastify";
import { CreateDeviceDTO, UpdateDeviceDTO } from "./device_schema";
import { createDevice, updateDevice, getDeviceById, getDevices, deleteDevice } from "./device_service";

export const createDeviceController = async (
    request: FastifyRequest<{ Body: CreateDeviceDTO }>,
    reply: FastifyReply
) => {
    try {
        const req = request.body
        const orgId = request.user.organizationId
        const newDevice = await createDevice(req, orgId)
        return reply.status(201).send(newDevice)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Location not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const getDevicesController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const orgId = request.user.organizationId
        const devices = await getDevices(orgId)
        return reply.status(200).send(devices)

    } catch (error: unknown) {

        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}


export const getDeviceByIdController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const orgId = request.user.organizationId
        const deviceById = await getDeviceById(id, orgId)
        return reply.status(200).send(deviceById)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Device not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const updateDeviceController = async (
    request: FastifyRequest<{ Params: { id: string }, Body: UpdateDeviceDTO }>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const orgId = request.user.organizationId
        const req = request.body
        const updateOldDevice = await updateDevice(req, id, orgId)
        return reply.status(200).send(updateOldDevice)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Device not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const deleteDeviceController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const orgId = request.user.organizationId
        const delDevice = await deleteDevice(id, orgId)
        return reply.status(200).send({ message: "Device deleted", name: delDevice.name })
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Device not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}