const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// @route   GET /api/boards
// @desc    Get all user boards
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user.id });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/boards
// @desc    Create a new board
router.post('/', auth, async (req, res) => {
  const { name, columns } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Board name is required' });
  }

  try {
    const newBoard = new Board({
      name,
      columns: columns && columns.length > 0 ? columns : ['To Do', 'Doing', 'Done'],
      user: req.user.id
    });

    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/boards/:id
// @desc    Update board name or reorder/rename columns
router.put('/:id', auth, async (req, res) => {
  const { name, columns, oldColumnName, newColumnName } = req.body;

  try {
    let board = await Board.findOne({ _id: req.params.id, user: req.user.id });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (name) board.name = name;
    
    // Updates array order and list directly
    if (columns) board.columns = columns;

    await board.save();

    // Cascading update: If a column was renamed, update all existing tasks under that status
    if (oldColumnName && newColumnName) {
      await Task.updateMany(
        { boardId: board._id, status: oldColumnName },
        { status: newColumnName }
      );
    }

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;