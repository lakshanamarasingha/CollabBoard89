const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      default: '' 
    },
    status: {
      type: String,
      default: 'To Do'
      // Note: enum removed to allow dynamic custom column names per board
    },
    assignedTo: { 
      type: String, 
      default: 'Unassigned' 
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);