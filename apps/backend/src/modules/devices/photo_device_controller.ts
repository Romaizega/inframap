import { FastifyRequest, FastifyReply } from "fastify";
import { uploadDevicePhoto, deletePhoto } from "./photo_service_device";


export const uploadDevicePhotoController = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;
    const orgId = request.user.organizationId;

    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ message: "No file provided" });
    }

    const fileBuffer = await data.toBuffer();
    const uploadPhoto = await uploadDevicePhoto(id, orgId, fileBuffer);
    return reply.status(201).send(uploadPhoto);
  } catch (error: unknown) {
    request.log.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
};

export const deletePhotoDeviceController = async (
  request: FastifyRequest<{ Params: { id: string; photoId: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { id, photoId } = request.params;
    const orgId = request.user.organizationId;
    const delPhoto = await deletePhoto(photoId, id, orgId);
    return reply.status(200).send({ message: "Photo deleted", delPhoto });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Photo not found") {
      return reply.status(404).send({ message: error.message });
    }
    request.log.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
};
