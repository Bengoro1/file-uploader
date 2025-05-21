import prisma from './prisma.js';
import cloudinary from '../config/cloudinaryConfig.js';

export const uploadFileToPrisma = async (file, userId, file_name) => {
  if (!file) {
    return new Error('No file provided')
  }

  await prisma.uploadedFile.create({
    data: {
      file_name,
      file_url: file.secure_url,
      size: file.bytes,
      userId,
      public_id: file.public_id,
      resource_type: file.resource_type
    }
  });
}

export const getUploadedFiles = async (userId) => await prisma.uploadedFile.findMany({ where: {AND: [{userId}, {folderId: null}] }, orderBy: {createdAt: 'asc'}});

export const findFile = async (id) => await prisma.uploadedFile.findUnique({where: {id}});

export const findFileByName = async (userId, file_name) => await prisma.uploadedFile.findUnique({where: {userId_file_name: {userId, file_name}}});

export const fileDelete = async (id) => {
  const file = findFile(id);
  if (!file) {
    throw new Error('File not found.');
  }

  await cloudinary.uploader.destroy(file.public_id, {
    resource_type: file.resource_type
  });

  await prisma.uploadedFile.delete({where: {id}});
}

export const renameFile = async (id, file_name) => await prisma.uploadedFile.update({where: {id}, data: {file_name}});

export const moveFile = async (id, folderId) => await prisma.uploadedFile.update({where: {id}, data: {folderId}});