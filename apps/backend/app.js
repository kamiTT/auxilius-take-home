const express = require('express');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.io = app.get('io');
  next();
});

app.get('/', (req, res) => {
  res.json({ ok: true });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

app.applySocketMiddleware = (io) => {
  app.set('io', io);

  io.use((socket, next) => {
    const requiredToken = process.env.SOCKET_IO_TOKEN;
    const providedToken = socket.handshake.auth && socket.handshake.auth.token;

    if (requiredToken && providedToken !== requiredToken) {
      return next(new Error('Unauthorized'));
    }

    next();
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

module.exports = app;
