var express = require('express');
var router = express.Router();
var db = require('../db');

var VALID_STATUS = ['to do', 'in progress', 'done'];

function isValidStatus(value) {
  return VALID_STATUS.indexOf(value) !== -1;
}

router.get('/', async function (req, res) {
  try {
    var result = await db.listTasks();
    res.json({ tasks: result.rows });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load tasks',
      details: error.message
    });
  }
});

router.get('/:id', async function (req, res) {
  try {
    var result = await db.getTaskById(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load task', details: error.message });
  }
});

router.post('/', async function (req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var status = req.body.status;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }
  if (description !== undefined && description !== null && typeof description !== 'string') {
    return res.status(400).json({ error: 'description must be a string' });
  }
  if (status !== undefined && !isValidStatus(status)) {
    return res.status(400).json({ error: 'status must be one of: to do, in progress, done' });
  }

  try {
    var result = await db.createTask({
      title: title.trim(),
      description: description,
      status: status
    });
    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

async function updateTask(req, res) {
  var fields = {};

  if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
    if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
      return res.status(400).json({ error: 'title must be a non-empty string' });
    }
    fields.title = req.body.title.trim();
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    if (req.body.description !== null && typeof req.body.description !== 'string') {
      return res.status(400).json({ error: 'description must be a string or null' });
    }
    fields.description = req.body.description;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
    if (!isValidStatus(req.body.status)) {
      return res.status(400).json({ error: 'status must be one of: to do, in progress, done' });
    }
    fields.status = req.body.status;
  }

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update' });
  }

  try {
    var result = await db.updateTask(req.params.id, fields);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
}

router.put('/:id', updateTask);
router.patch('/:id', updateTask);

router.delete('/:id', async function (req, res) {
  try {
    var result = await db.deleteTask(req.params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});

module.exports = router;
