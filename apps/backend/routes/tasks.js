var express = require('express');
var router = express.Router();

var tasks = [
  { id: 1, title: 'Set up backend', completed: true },
  { id: 2, title: 'Add tasks endpoint', completed: true }
];

router.get('/', function (req, res) {
  res.json({ tasks: tasks });
});

module.exports = router;

