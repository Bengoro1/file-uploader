export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/auth/log-in');
}