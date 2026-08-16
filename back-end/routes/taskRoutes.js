const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

// Task endpoints (unprotected for local testing; wrap with `protect` for JWT enforcement)
router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

module.exports = router;