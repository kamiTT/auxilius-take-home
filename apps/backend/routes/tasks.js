const express = require('express');
const router = express.Router();
const db = require('../db');

const VALID_STATUS = ['to do', 'in progress', 'done'];

const isValidStatus = (value) => VALID_STATUS.indexOf(value) !== -1;

router.get('/', async (req, res) => {
  try {
    const result = await db.listTasks();
    res.json({ tasks: result.rows });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load tasks',
      details: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.getTaskById(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ task: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load task', details: error.message });
  }
});

router.post('/', async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const status = req.body.status;

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
    const result = await db.createTask({
      title: title.trim(),
      description: description,
      status: status
    });
    const createdTask = result.rows[0];
    if (req.io) {
      req.io.emit('task:created', createdTask);
    }
    res.status(201).json({ task: createdTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', details: error.message });
  }
});

const updateTask = async (req, res) => {
  const fields = {};

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
    const result = await db.updateTask(req.params.id, fields);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const updatedTask = result.rows[0];
    if (req.io) {
      req.io.emit('task:updated', updatedTask);
    }
    res.json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', details: error.message });
  }
};

router.put('/:id', updateTask);
router.patch('/:id', updateTask);

router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const result = await db.deleteTask(taskId);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (req.io) {
      req.io.emit('task:deleted', { id: taskId });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', details: error.message });
  }
});

module.exports = router;
