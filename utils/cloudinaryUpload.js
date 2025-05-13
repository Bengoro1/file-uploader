import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier';

export function streamUpload(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}