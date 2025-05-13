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
import folderRouter from './routes/folderRoutes.js';
import { getAllFolders } from './db/folderQueries.js';

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
app.use(isAuthenticated, uploadRouter);
app.use('/folder', isAuthenticated, folderRouter);

app.get('/', isAuthenticated, async (req, res) => {
  try {
    const uploads = await getUploadedFiles(req.user.id);
    const folders = await getAllFolders(req.user.id);
    res.render('home', {
      title: 'Home',
      message: res.locals.message || '',
      folders,
      uploads
    });
  } catch (err) {
    console.error('Error fetching files and folders: ', err);
    res.render('home', {
      title: 'Home',
      message: 'Error loading files and folders',
      uploads: [],
      folders: []
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

// add url to file on Prisma
// test
// Update your uploadFileToPrisma and uploadFileToPrismaFolder functions to accept the Cloudinary upload result