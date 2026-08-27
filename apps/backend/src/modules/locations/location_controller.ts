import { FastifyRequest, FastifyReply } from "fastify";
import { CreateLocationDTO, UpdateLocationDTO } from "./location_schema";
import { createLocation, updateLocation, getLocationById, getLocations, deleteLocation } from './location_service'

export const createLocationController = async (
    request: FastifyRequest<{ Body: CreateLocationDTO }>,
    reply: FastifyReply
) => {
    try {
        const req = request.body
        const orgId = request.user.organizationId
        const newLocation = await createLocation(req, orgId)
        return reply.status(201).send(newLocation)
    } catch (error: unknown) {
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })

    }
}

export const getLocationsController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        console.log('getLocationController called')
        const orgId = request.user.organizationId
        const locations = await getLocations(orgId)
        return reply.status(200).send(locations)
    } catch (error: unknown) {
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const getLocationByIdController = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const orgId = request.user.organizationId
        const locationById = await getLocationById(id, orgId)
        return reply.status(200).send(locationById)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Location not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const updateLocationController = async (
    request: FastifyRequest<{ Params: { id: string }, Body: UpdateLocationDTO }>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const orgId = request.user.organizationId
        const req = request.body
        const updateOldLocation = await updateLocation(req, id, orgId)
        return reply.status(200).send(updateOldLocation)
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Location not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}

export const deleteLocationController = async (
    request: FastifyRequest<{ Params: { id: string }}>,
    reply: FastifyReply
) => {
    try {
        const { id } = request.params
        const orgId = request.user.organizationId
        const delLocation = await deleteLocation( id, orgId)
        return reply.status(200).send({message: "Location deleted", name: delLocation.site})
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "Location not found") {
            return reply.status(404).send({ message: error.message })
        }
        request.log.error(error)
        return reply.status(500).send({ message: "Server error" })
    }
}