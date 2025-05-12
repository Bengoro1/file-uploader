import { folderGet, folderCreate, renameFolder, folderDelete, findFolderByName } from "../db/folderQueries.js";
import {body, validationResult} from 'express-validator';

const validateFolderName = [
  body('folderName')
    .notEmpty().withMessage('Folder name can\'t be empty.')
    .custom(async (value, {req}) => {
      const currentFolder = await folderGet(+req.params.folderId);
      if (!currentFolder) {
        throw new Error('Folder not found.');
      }

      if (value === currentFolder.folder_name) {
        return true;
      }

      const nameInUse = await findFolderByName(req.user.id, value);
      if (nameInUse) {
        throw new Error('Folder already exists.')
      }
      return true;
    }),
];

export const getFolder = async (req, res) => {
  try {
    const folder = await folderGet(+req.params.folderId);
    res.render('Folder', {
      title: folder.folder_name,
      message: res.locals.message || '',
      uploads: folder.files,
      folderId: folder.id
    });
  } catch (err) {
    console.error('Error fetching folder: ', err);
    res.render('home', {
      title: 'Home',
      message: 'Error loading folder',
      uploads: []
    });
  }
}

export const createFolder = async (req, res, next) => {
  try {
    await folderCreate(req.user.id, req.body.folderName);
    return res.redirect('/');
  } catch (err) {
    next(err);
  }
}

export const getCreateForm = (req, res) => {
  return res.render('folderForm', {title: 'Create folder'});
}

export const getEditForm = async (req, res) => {
  try {
    const folder = await folderGet(+req.params.folderId);
    return res.render('folderForm', {title: 'Edit folder', folderId: req.params.folderId, folderName: folder.folder_name});
  } catch (err) {
    next(err);
  }
}

export const editFolder = [
  validateFolderName,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const folder = await folderGet(+req.params.folderId);
      return res.status(400).render('folderForm', {
        errors: errors.array(),
        title: 'Edit folder',
        folderId: req.params.folderId,
        folderName: folder.folder_name
      });
    }
    try {
      const oldFolder = await folderGet(+req.params.folderId);
      const newName = req.body.folderName;
      if (oldFolder.folder_name !== newName) {
        await renameFolder(+req.params.folderId, req.body.folderName);
        req.session.message = `Folder was renamed from "${oldFolder.folder_name}" to "${newName}".`;
      }

      req.session.save(() => {
        return res.redirect(`/folder/${req.params.folderId}`);
      });
    } catch (err) {
      console.error('An error occurred while editing folder:', err);
      req.session.message = 'There was an error while editing the folder.';
      req.session.save(() => {
        return res.redirect(`/folder/${req.params.folderId}`);
      });
    }
  }
];

export const deleteFolder = async (req, res, next) => {
  try {
    await folderDelete(+req.params.folderId);
    return res.redirect('/');
  } catch (err) {
    next(err);
  }
}