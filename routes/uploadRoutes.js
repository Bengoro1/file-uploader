import { Router } from "express";
import upload from '../middlewares/upload.js';
import { uploadFile, getEditForm, editFile, deleteFile } from "../controllers/uploadController.js";

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);
router.get('/file/:fileId/edit', getEditForm);
router.post('/file/:fileId/edit', editFile);
router.post('/file/:fileId/delete', deleteFile)

export default router;