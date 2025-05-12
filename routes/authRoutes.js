import { Router } from "express";
import passport from "passport";
import controller from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/log-in', controller.login);
router.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/log-in',
  failureMessage: true
}));
router.get('/sign-up', controller.signUp);
router.post('/sign-up', controller.registerUser);
router.get('/log-out', isAuthenticated, controller.logOut);

export default router;