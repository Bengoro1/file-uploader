import prisma from './prisma.js';

export const uploadFileToPrisma = async (file, userId) => {
  if (!file) {
    return new Error('No file provided')
  }

  await prisma.uploadedFile.create({
    data: {
      file_name: file.filename,
      path: file.path,
      size: file.size,
      userId
    }
  });
}

export const getUploadedFiles = async (userId) => await prisma.uploadedFile.findMany({ where: {AND: [{userId}, {folderId: null}] }, orderBy: {createdAt: 'asc'}});

export const findFile = async (id) => await prisma.uploadedFile.findUnique({where: {id}});

export const findFileByName = async (userId, file_name) => await prisma.uploadedFile.findUnique({where: {userId_file_name: {userId, file_name}}});

export const fileDelete = async (id) => await prisma.uploadedFile.delete({where: {id}});

export const renameFile = async (id, file_name) => await prisma.uploadedFile.update({where: {id}, data: {file_name}});

export const moveFile = async (id, folderId) => await prisma.uploadedFile.update({where: {id}, data: {folderId}});