import multer from 'multer';
import path from 'node:path';
import fs from 'fs/promises';

const __dirname = import.meta.dirname;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({storage});

const uploadDir = path.join(__dirname, '../public/uploads');

export const getUploadedFiles = async () => {
  try {
    const files = fs.readdir(uploadDir);
    return files;
  } catch (err) {
    console.error('Error reading uploads directory: ', err);
    return [];
  }
}

export default upload;