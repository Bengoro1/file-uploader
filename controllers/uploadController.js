export const uploadFile = (req, res) => {
  if (!req.file) {
    req.session.message = 'No file uploaded!';
  } else {
    req.session.message = `File uploaded: ${req.file.filename}`;
  }
  
  req.session.save(() => {
    res.redirect('/');
  });
}