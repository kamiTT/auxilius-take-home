var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', async function (req, res) {
  try {
    var result = await db.getTasks();
    res.json({ tasks: result.rows });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load tasks',
      details: error.message
    });
  }
});

module.exports = router;
