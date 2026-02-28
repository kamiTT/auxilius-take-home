var express = require('express');
var tasksRouter = require('./routes/tasks');

var app = express();

app.use(express.json());

app.get('/', function (req, res) {
  res.json({ ok: true });
});

app.get('/health', function (req, res) {
  res.json({ ok: true });
});

app.use('/tasks', tasksRouter);

module.exports = app;

