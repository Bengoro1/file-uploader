import { Router } from "express";
import upload from '../middlewares/upload.js';
import { uploadFile } from "../controllers/uploadController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/upload', isAuthenticated, upload.single('file'), uploadFile);

export default router;