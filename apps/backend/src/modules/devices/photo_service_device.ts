import prisma from "../../lib/prisma";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export const uploadDevicePhoto = async (
  deviceId: string,
  organizationId: string,
  fileBuffer: Buffer,
) => {
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      location: { organizationId },
    },
  });

  if (!device) {
    throw new Error("Device not found");
  }

  const dirPath = path.join(process.cwd(), "uploads", "devices", deviceId);
  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = path.join(dirPath, fileName);
  await fs.mkdir(dirPath, { recursive: true });
  await sharp(fileBuffer).webp({ quality: 80 }).toFile(filePath);
  const dbPath = `/uploads/devices/${deviceId}/${fileName}`;

  return prisma.devicePhoto.create({
    data: {
      deviceId,
      path: dbPath,
    },
  });
};

export const deletePhoto = async (
  id: string,
  deviceId: string,
  organizationId: string,
) => {
  const device = await prisma.device.findFirst({
    where: {
      id: deviceId,
      location: { organizationId },
    },
  });

  if (!device) {
    throw new Error("Device not found");
  }
  const photo = await prisma.devicePhoto.findFirst({
    where: {
      id,
    },
  });
  if (!photo) {
    throw new Error("Photo not found");
  }
  const absolutePath = path.join(process.cwd(), photo.path);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {}

  return prisma.devicePhoto.delete({
    where: {
      id,
      deviceId,
    },
  });
};
