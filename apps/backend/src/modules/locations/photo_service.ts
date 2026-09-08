import prisma from "../../lib/prisma";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export const uploadLocationPhoto = async (
  locationId: string,
  organizationId: string,
  fileBuffer: Buffer,
) => {
  const location = await prisma.location.findFirst({
    where: {
      id: locationId,
      organizationId,
    },
  });

  if (!location) {
    throw new Error("Location not found");
  }

  const dirPath = path.join(process.cwd(), "uploads", "locations", locationId);
  const fileName = `${crypto.randomUUID()}.webp`;
  const filePath = path.join(dirPath, fileName);
  await fs.mkdir(dirPath, { recursive: true });
  await sharp(fileBuffer).webp({ quality: 80 }).toFile(filePath);
  const dbPath = `/uploads/locations/${locationId}/${fileName}`;

  return prisma.photoSite.create({
    data: {
      locationId,
      path: dbPath,
    },
  });
};

export const deletePhoto = async (
  id: string,
  locationId: string,
  organizationId: string,
) => {
  const location = await prisma.location.findFirst({
    where: {
      id: locationId,
      organizationId,
    },
  });

  if (!location) {
    throw new Error("Location not found");
  }
  const photo = await prisma.photoSite.findFirst({
    where: {
      id,
    },
  });
  if (!photo) {
    throw new Error("Photo not found");
  }
  const absolutePath = path.join(process.cwd(), photo.path);
  try {
    await fs.unlink(absolutePath)
  } catch (error) {
    
  }

  return prisma.photoSite.delete({
    where: {
      id,
      locationId,
    },
  });
};
