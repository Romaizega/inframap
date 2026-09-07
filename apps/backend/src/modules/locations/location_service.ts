import prisma from "../../lib/prisma";
import { CreateLocationDTO, UpdateLocationDTO } from "./location_schema";

export const createLocation = async (
  data: CreateLocationDTO,
  organizationId: string,
) => {
  return prisma.location.create({
    data: {
      ...data,
      organizationId,
    },
  });
};

export const getLocations = async (organizationId: string) => {
  const result = await prisma.location.findMany({
    where: {
      organizationId,
    },
    include: {
      devices: {
        select: {
          status: true,
        },
      },
    },
  });
  console.log(JSON.stringify(result[0], null, 2));
  return result;
};

export const getLocationById = async (id: string, organizationId: string) => {
  const location = await prisma.location.findFirst({
    where: {
      id,
      organizationId,
    },
    select: {
      id: true,
      site: true,
      building: true,
      floor: true,
      latitude: true,
      longitude: true,
      accessinstruction: true,
      description: true,
      createdAt: true,
      updatedAt: true,

      devices: {
        select: {
          id: true,
          name: true,
          status: true,
          rackUnit: true,
          rackSize: true,
          type: true,
          ip_address: true,
          manufacturer: true,
          model: true,
        },
      },
    },
  });

  if (!location) {
    throw new Error("Location not found");
  }

  return location;
};

export const updateLocation = async (
  data: UpdateLocationDTO,
  id: string,
  organizationId: string,
) => {
  const location = await prisma.location.findFirst({
    where: {
      id,
      organizationId,
    },
  });
  if (!location) {
    throw new Error("Location not found");
  }
  return prisma.location.update({
    where: { id },
    data: { ...data },
  });
};

export const deleteLocation = async (id: string, organizationId: string) => {
  const location = await prisma.location.findFirst({
    where: {
      id,
      organizationId,
    },
  });
  if (!location) {
    throw new Error("Location not found");
  }
  return prisma.location.delete({
    where: { id },
  });
};
