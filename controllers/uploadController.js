import { uploadFileToPrisma, findFile, findFileByName, fileDelete, moveFile, renameFile } from "../db/uploadQueries.js";
import { uploadFileToPrismaFolder, getAllFolders, folderGet } from "../db/folderQueries.js";
import { body, validationResult } from "express-validator";
import {streamUpload} from '../utils/cloudinaryUpload.js';
import {v4 as uuidv4} from 'uuid';
import path from 'path';


const validateFileName = [
  body('fileName')
    .notEmpty().withMessage('File name can\'t be empty.')
    .custom(async (value, {req}) => {
      const currentFile = await findFile(+req.params.fileId);
      if (!currentFile) {
        throw new Error('File not found.');
      }

      if (value === currentFile.file_name) {
        return true;
      }

      const nameInUse = await findFileByName(req.user.id, value);
      if (nameInUse) {
        throw new Error('File already exists.')
      }
      return true;
    }),
];

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      req.session.message = 'No file uploaded!';
    } else {
      const ext = path.extname(req.file.originalname);
      const public_id = `${uuidv4()}${ext}`;
      const original_name = req.file.originalname;

      const nameInUse = await findFileByName(req.user.id, original_name);
      if (nameInUse) {
        req.session.message = 'File already exists.';
        req.session.save(() => {
          return res.redirect(req.params.folderId ? `/folder/${req.params.folderId}` : '/');
        });
      }

      let resource_type = 'raw';
      if (req.file.mimetype.startsWith('image/')) {
        resource_type = 'image';
      } else if (req.file.mimetype.startsWith('video/')) {
        resource_type = 'video';
      }

      const cloudResult = await streamUpload(req.file.buffer, {
        folder: 'file-uploader',
        public_id,
        resource_type
      });

      if (req.params.folderId) {
        await uploadFileToPrismaFolder(cloudResult, +req.params.folderId, req.user.id, original_name);
      } else {
        await uploadFileToPrisma(cloudResult, req.user.id, original_name);
      }

      req.session.message = `File uploaded: ${original_name}`;
    }
    
    req.session.save(() => {
      res.redirect(req.params.folderId ? `/folder/${req.params.folderId}` : '/');
    });
  } catch (err) {
    console.error('An error occurred uploading file: ', err);
    req.session.message = 'There was an error uploading the file.';
    req.session.save(() => {
      res.redirect(req.params.folderId ? `/folder/${req.params.folderId}` : '/');
    });
  }
}

export const getEditForm = async (req, res) => {
  const folders = await getAllFolders(req.user.id);
  const file = await findFile(+req.params.fileId);
  return res.render('fileForm', {
    title: 'Edit file',
    fileId: req.params.fileId,
    folders,
    fileName: file.file_name,
    fileFolderId: file.folderId
  });
}

export const editFile = [
  validateFileName,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const folders = await getAllFolders(req.user.id);
      const file = await findFile(+req.params.fileId);
      return res.render('fileForm', {
        errors: errors.array(),
        title: 'Edit file',
        fileId: req.params.fileId,
        folders,
        fileName: file.file_name,
        fileFolderId: file.folderId
      });
    }
    try {
      let folderId = req.body.folderId;
      if (folderId === 'null' || folderId === '') {
        folderId = null
      } else {
        folderId = +folderId;
      }

      const oldFile = await findFile(+req.params.fileId);
      let message = '';

      if (oldFile.file_name !== req.body.fileName) {
        await renameFile(+req.params.fileId, req.body.fileName);
        message += `File was renamed from "${oldFile.file_name}" to "${req.body.fileName}" .`;
      }

      if (oldFile.folderId !== folderId) {
        const oldFolder = oldFile.folderId ? await folderGet(oldFile.folderId) : { folder_name: 'Main directory'};
        const newFolder = folderId ? await folderGet(folderId) : { folder_name: 'Main directory'};
        await moveFile(+req.params.fileId, folderId);
        message += `File was moved from "${oldFolder.folder_name}" to "${newFolder.folder_name}.`;
      }

      req.session.message = message.trim();
      req.session.save(() => {
        return res.redirect(`/${folderId ? 'folder/' + folderId : ''}`);
      });
    } catch (err) {
      next(err);
    }
  }
];

export const deleteFile = async (req, res, next) => {
  try {
    await fileDelete(+req.params.fileId);
    return res.redirect('/');
  } catch (err) {
    next(err);
  }
}