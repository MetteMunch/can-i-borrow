import 'dotenv/config';
import express from 'express';

const app = express();

app.use(express.json());

import cors from 'cors';
app.use(
  cors({
    origin: 'http://localhost:5173', // Svelte dev server
    credentials: true,
  })
);

import session from 'express-session';
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  },
});

app.use(sessionMiddleware);

import http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.engine.use(sessionMiddleware);

io.on('connection', (socket) => {
  const session = socket.request.session;

  if (!session?.user) {
    console.log('Socket connected without user');
    return;
  }

  const userId = session.user.id;
  console.log('Socket connected for user', userId);

  // 👇 vigtigt
  socket.join(`user-${userId}`);

  socket.on('disconnect', () => {
    console.log('Socket disconnected for user', userId);
  });
});

import sessionRouter from './routes/sessionRouter.js';
app.use('/session', sessionRouter);

import authRouter from './routes/authRouter.js';
app.use('/auth', authRouter);

import itemsRouter from './routes/itemsRouter.js';
app.use('/items', itemsRouter);

import reservationsRouter from './routes/reservationsRouter.js';
app.use('/reservations', reservationsRouter);
app.set('io', io);

import fileRouter from './routes/fileRouter.js';
app.use('/files', fileRouter);

import uploadRouter from './routes/localFileRouter.js';
app.use('/uploads', uploadRouter);
app.use('/uploads', express.static('uploads'));

app.get('/test', (req, res) => {
  res.send({ data: 'Der er hul igennem til test' });
});

app.all('/{*splat}', (req, res) => {
  res.status(404).send({ data: "Didn't match with a route" });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log('Server is running on: ', PORT);
});
