import { Router } from "express";
import { getFolder, createFolder, getCreateForm, getEditForm, editFolder, deleteFolder } from "../controllers/folderController.js";
import upload from "../middlewares/upload.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = Router();

router.get('/create', getCreateForm);
router.post('/create', createFolder);
router.get('/:folderId', getFolder);
router.post('/:folderId/upload', upload.single('file'), uploadFile);
router.get('/:folderId/edit', getEditForm);
router.post('/:folderId/edit', editFolder);
router.post('/:folderId/delete', deleteFolder);

export default router;