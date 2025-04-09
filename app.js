import express from 'express';
import path from 'node:path';
import passport from 'passport';
import passportConfig from './config/passportConfig.js';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import prisma from './db/prisma.js';
import 'dotenv/config';
import authRouter from './routes/authRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import { isAuthenticated } from './middlewares/authMiddleware.js';
import { getUploadedFiles } from './db/uploadQueries.js';

const app = express();

const __dirname = import.meta.dirname;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

passportConfig(passport);

app.use((req, res, next) => {
  if (req.session.message) {
    res.locals.message = req.session.message;
    delete req.session.message;
  }
  next();
});
app.use('/auth', authRouter);
app.use(uploadRouter);

app.get('/', isAuthenticated, async (req, res) => {
  try {
    const uploads = await getUploadedFiles();
    res.render('home', {
      title: 'Home',
      message: res.locals.message || '',
      uploads: uploads
    });
  } catch (err) {
    console.error('Error fetching files: ', err);
    res.render('home', {
      title: 'Home',
      message: 'Error loading files',
      uploads: []
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));