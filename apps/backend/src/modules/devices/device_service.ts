import prisma from "../../lib/prisma";
import { CreateDeviceDTO, UpdateDeviceDTO } from "./device_schema";

export const createDevice = async (data: CreateDeviceDTO, organizationId: string) => {
    const location = await prisma.location.findFirst({
        where:{
            id: data.locationId,
            organizationId
        }
     })
     if(!location) {
        throw new Error ('Location not found')
     }
     return prisma.device.create({
        data:{
            ...data,
            status: data.status ?? "OFFLINE"
        }
     })
}

export const getDevices = async (organizationId: string) => {
    return prisma.device.findMany({
        where: {
            location: {organizationId}
        }
    })
}
export const updateDevice = async (data: UpdateDeviceDTO, id: string, organizationId: string) => {
    const device = await prisma.device.findFirst({
        where : {
            id,
            location: {organizationId}
        }
    })
    if(!device) {
        throw new Error ('Device not found')
    }
    return prisma.device.update({
        where: {id},
        data: {...data}
    })
}

export const getDeviceById = async (id: string, organizationId: string) => {
    const device = await prisma.device.findFirst({
        where : {
            id,
            location: {organizationId}
        }
    })
    if(!device) {
        throw new Error ('Device not found')
    }
    return device
}

export const deleteDevice = async (id: string, organizationId: string) => {
        const device = await prisma.device.findFirst({
        where : {
            id,
            location: {organizationId}
        }
    })
    if(!device) {
        throw new Error ('Device not found')
    }
    return prisma.device.delete({
        where: {id}
    })
}