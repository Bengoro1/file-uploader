import { Router } from "express";
import passport from "passport";
import controller from "../controllers/authController";

const router = Router();

router.get('/log-in', controller.login);
router.post('/log-in', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/log-in',
  failureMessage: true
}));