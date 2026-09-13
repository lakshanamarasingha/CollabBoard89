const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Protect all routes with auth middleware
router.use(auth);

// GET /api/tasks - Fetch tasks filtered strictly by user AND boardId
router.get('/', async (req, res) => {
  try {
    const { boardId } = req.query;

    const filter = {
      user: req.user.id,
      boardId: boardId && boardId !== 'null' && boardId !== 'undefined' ? boardId : null
    };

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/tasks - Create task with board assignment and validation
router.post('/', async (req, res) => {
  try {
    const { title, description, status, boardId, dueDate } = req.body;

    // Validation 1: Title required & >= 3 chars
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters long.' });
    }

    // Validation 2: Due date must not be in the past
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({ message: 'Due date cannot be set in the past.' });
      }
    }

    // Assign req.user.id and fallback boardId safely
    const newTask = new Task({
      title: title.trim(),
      description: description || '',
      status: status || 'To Do',
      boardId: boardId && boardId !== 'null' ? boardId : null,
      user: req.user.id
    });

    const savedTask = await newTask.save();

    // Socket.io Broadcast
    const io = req.app.get('io');
    if (io) io.emit('task:created', savedTask);

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/tasks/:id - Update task status or info safely
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const io = req.app.get('io');
    if (io) io.emit('task:updated', updatedTask);

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id - Delete task owned by user
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    const io = req.app.get('io');
    if (io) io.emit('task:deleted', req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;