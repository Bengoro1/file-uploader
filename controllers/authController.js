import bcrypt from "bcryptjs";
import prisma from '../db/prisma';
import {body, validationResult} from 'express-validator';

const alphaErr = 'must contain only letters.';

const validateRegister = [
  body('first_name')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isAlpha().withMessage(`First name ${alphaErr}`),
  body('last_name')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail().withMessage('Must be a valid email.')
    .normalizeEmail(),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          username: value
        },
      });
      if (user) {
        throw new Error('Username is already in use.');
      }
      return true;
    })
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('passwordConfirmation')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

function login(req, res, next) {
  const errorMessage = {msg: req.session.messages?.[0]};
  req.session.messages = [];
  if (errorMessage.msg) {
    return res.render('login', {
      title: 'Log in',
      errors: errorMessage ? [errorMessage] : []
    });
  }
  try {
    res.render('login', {
      title: 'Log in'
    });
  } catch(err) {
    next(err);
  }
}

const controller = {login, }

export default controller;