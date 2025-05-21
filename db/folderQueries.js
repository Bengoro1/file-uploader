import prisma from "./prisma.js";

export const folderGet = async (folderId) => {
  return await prisma.folder.findFirst({
    where: {id: folderId},
    include: {files: true}
  });
}

export const getAllFolders = async (userId) => {
  return await prisma.folder.findMany({where: {userId}, orderBy: {createdAt: 'asc'}});
}

export const uploadFileToPrismaFolder = async (file, folderId, userId, file_name) => {
  if (!file) {
    return new Error('No file provided')
  }

  if (!folderId) {
    return new Error('Folder is required for this function')
  }

  await prisma.uploadedFile.create({
    data: {
      file_name,
      path: file.path,
      size: file.size,
      folderId,
      userId,
      public_id: file.public_id,
      resource_type: file.resource_type
    }
  });

  if (folderId) {
    await prisma.folder.update({
      where: {id: folderId},
      data: {updatedAt: new Date()},
    });
  }
}

export const folderCreate = async (userId, folder_name) => {
  await prisma.folder.create({
    data: {
      folder_name,
      userId
    }
  });
}

export const renameFolder = async (id, folder_name) => {
  await prisma.folder.update({
    where: {id},
    data: {folder_name}
  });
}

export const folderDelete = async (id) => {
  if (!id) {
    throw new Error('Folder ID is required')
  }
  try {
    await prisma.uploadedFile.deleteMany({
      where: {folderId: id}
    });
    await prisma.folder.delete({
      where: {id}
    });
  } catch (err) {
    console.error(`Failed to delete folder ${id}: `, err);
    throw new Error('Failed to delete folder.');
  }
}

export const findFolderByName = async (userId, folder_name) => await prisma.folder.findFirst({where: {AND: [{userId}, {folder_name}]}});