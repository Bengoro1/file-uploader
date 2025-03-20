export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded!');
  }
  res.send(`File uploaded: ${req.file.filename}`);
}