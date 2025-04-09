import prisma from './prisma.js';

export const uploadFileToPrisma = async (file) => {
  if (!file) {
    return new Error('No file provided')
  }

  await prisma.uploadedFile.create({
    data: {
      file_name: file.originalname,
      path: file.path,
      size: file.size
    }
  });
}