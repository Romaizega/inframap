import prisma from "../../lib/prisma";
import { CreateMaintenceLogDTO, UpdateMaintenceLogDTO } from "./maintenance_schema";


export const createLog = async (
    data: CreateMaintenceLogDTO,
    deviceId: string,
    userId: string,
    organizationId: string) => {

    const device = await prisma.device.findFirst({
        where: {
            id: deviceId,
            location: { organizationId }
        }
    })
    if (!device) {
        throw new Error('Device not found')
    }
    return prisma.maintenanceLog.create({
        data: {
            ...data,
            userId: userId,
            deviceId: deviceId,
            plannedAt: data.plannedAt ? new Date(data.plannedAt) : undefined
        }
    })
}

export const getLogsByDevice = async (deviceId: string, organizationId: string) => {
    const device = await prisma.device.findFirst({
        where: {
            id: deviceId,
            location: { organizationId }
        }
    })
    if (!device) {
        throw new Error('Device not found')
    }
    return prisma.maintenanceLog.findMany({
        where: { deviceId },
        include: { user: { select: { id: true, email: true } } }
    })
}


export const getLogById = async (id: string, organizationId: string) => {

    return prisma.maintenanceLog.findFirst({
        where: {
            id,
            device: {
                location: { organizationId }
            }
        }
    })
}


export const updateLog = async (data: UpdateMaintenceLogDTO, id: string, organizationId: string) => {
    const getLog = await getLogById(id, organizationId)
    if (!getLog) {
        throw new Error('Log not found')
    }
    return prisma.maintenanceLog.update({
        where: { id },
        data: { ...data, plannedAt: data.plannedAt === null ? null : data.plannedAt ? new Date(data.plannedAt) : undefined }
    })
}

export const deleteLog = async (id: string, organizationId: string) => {
    const getLog = await getLogById(id, organizationId)
    if (!getLog) {
        throw new Error('Log not found')
    }
    return prisma.maintenanceLog.delete({
        where: { id }
    })
}