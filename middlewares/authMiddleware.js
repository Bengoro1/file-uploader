export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  }
  res.redirect('/auth/log-in');
}