import { uploadFileToPrisma } from "../db/uploadQueries.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      req.session.message = 'No file uploaded!';
    } else {
      await uploadFileToPrisma(req.file);
      req.session.message = `File uploaded: ${req.file.filename}`;
    }
    
    req.session.save(() => {
      res.redirect('/');
    });
  } catch (err) {
    console.error('An error occurred uploading file: ', err);
    req.session.message = 'There was an error uploading the file.';
    req.session.save(() => {
      res.redirect('/');
    });
  }
}