const express = require('express');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

module.exports = app;
