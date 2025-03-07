import passport from 'passport';
import {Strategy as LocalStrategy} from'passport-local';
import * as bcrypt from 'bcryptjs';
import prisma from '../db/prisma';

passport.use(new LocalStrategy(async (username, password, done) => {
  try {

  }
}))