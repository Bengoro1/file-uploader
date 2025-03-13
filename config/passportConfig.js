import {Strategy as LocalStrategy} from'passport-local';
import * as bcrypt from 'bcryptjs';
import prisma from '../db/prisma';

export default function passportConfig(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {username: username},
        });
        if (!user) {
          return done(null, false, {message: 'Username doesn\'t exist.'})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {message: 'Incorrect password.'})
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {id: id}
      });
      done(null, user);
    } catch(err) {
      done(err);
    }
  });
}