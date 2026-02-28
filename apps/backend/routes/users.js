const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.listUsers();
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load users', details: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.getUserById(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load user', details: error.message });
  }
});

router.post('/', async (req, res) => {
  const username = req.body.username;
  if (typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    const result = await db.createUser({ username: username.trim() });
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'username already exists' });
    }
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

const updateUser = async (req, res) => {
  if (!Object.prototype.hasOwnProperty.call(req.body, 'username')) {
    return res.status(400).json({ error: 'username is required for update' });
  }

  const username = req.body.username;
  if (typeof username !== 'string' || username.trim() === '') {
    return res.status(400).json({ error: 'username must be a non-empty string' });
  }

  try {
    const result = await db.updateUser(req.params.id, { username: username.trim() });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'username already exists' });
    }
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

router.put('/:id', updateUser);
router.patch('/:id', updateUser);

router.delete('/:id', async (req, res) => {
  try {
    const result = await db.deleteUser(req.params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

module.exports = router;
